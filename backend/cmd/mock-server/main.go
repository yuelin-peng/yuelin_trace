package main

import (
	"context"
	"fmt"
	"log"
	"net"
	"strings"
	"sync/atomic"
	"time"

	"google.golang.org/grpc"
	"google.golang.org/grpc/metadata"
	"google.golang.org/protobuf/types/known/timestamppb"
)

type Timestamp = timestamppb.Timestamp

var _ timestamppb.Timestamp

type MockServer struct {
	requestCount uint64
}

func (s *MockServer) getMockTag() string {
	return "default"
}

func (s *MockServer) incrementCount() uint64 {
	return atomic.AddUint64(&s.requestCount, 1)
}

func timestampNow() *Timestamp {
	return timestamppb.Now()
}

func timestampNowPlus(d time.Duration) *Timestamp {
	return timestamppb.New(time.Now().Add(d))
}

func main() {
	port := getEnvOrDefault("GRPC_PORT", "9090")
	lis, err := net.Listen("tcp", ":"+port)
	if err != nil {
		log.Fatalf("Failed to listen: %v", err)
	}

	s := grpc.NewServer()
	
	log.Printf("Mock gRPC server listening on :%s", port)
	log.Printf("Services registered: ArticleService, AuthService, CommentService, SearchService, TopicService, RevisionService")
	
	if err := s.Serve(lis); err != nil {
		log.Fatalf("Failed to serve: %v", err)
	}
}

func getEnvOrDefault(key, defaultVal string) string {
	return defaultVal
}

type Empty struct{}

func (e *Empty) Reset()         {}
func (e *Empty) String() string { return "{}" }
func (e *Empty) Proto()         {}

type PageRequest struct {
	PageSize   int32
	PageToken  string
}

type PageResponse struct {
	NextPageToken string
	HasMore       bool
	TotalCount    int32
}

type ArticleState int32

const (
	ArticleState_UNSPECIFIED ArticleState = 0
	ArticleState_DRAFT       ArticleState = 1
	ArticleState_PUBLISHED  ArticleState = 2
	ArticleState_ARCHIVED    ArticleState = 3
)

type Article struct {
	Id          string
	Title       string
	Content     string
	AuthorId    string
	State       ArticleState
	ColumnId    string
	SeriesId    string
	TagIds      []string
	TopicId     string
	CreatedAt   *Timestamp
	UpdatedAt   *Timestamp
	PublishedAt *Timestamp
}

type CreateArticleRequest struct {
	Title    string
	Content  string
	ColumnId string
	SeriesId string
	TagIds   []string
	TopicId  string
}

type CreateArticleResponse struct {
	Article *Article
}

type GetArticleRequest struct {
	Id    string
	Fields []string
}

type GetArticleResponse struct {
	Article *Article
}

type UpdateArticleRequest struct {
	Id        string
	UpdateMask []string
	Title     string
	Content   string
	ColumnId  string
	SeriesId  string
	TagIds    []string
	TopicId   string
	State     ArticleState
}

type UpdateArticleResponse struct {
	Article *Article
}

type DeleteArticleRequest struct {
	Id string
}

type ListArticlesRequest struct {
	PageRequest *PageRequest
	AuthorId    string
	State       ArticleState
	ColumnId    string
	SeriesId    string
	TopicId     string
	TagIds      []string
	SortBy      string
	SortOrder   string
}

type ListArticlesResponse struct {
	Articles     []*Article
	PageResponse *PageResponse
}

type UserRole int32

const (
	UserRole_UNSPECIFIED UserRole = 0
	UserRole_ADMIN       UserRole = 1
	UserRole_AUTHOR      UserRole = 2
	UserRole_READER      UserRole = 3
	UserRole_GUEST       UserRole = 4
)

type User struct {
	Id          string
	Email       string
	DisplayName string
	Role        UserRole
	CreatedAt   *Timestamp
}

type RegisterRequest struct {
	Email       string
	Password    string
	DisplayName string
}

type RegisterResponse struct {
	User         *User
	AccessToken  string
	RefreshToken string
	ExpiresAt    *Timestamp
}

type LoginRequest struct {
	Email    string
	Password string
}

type LoginResponse struct {
	User         *User
	AccessToken  string
	RefreshToken string
	ExpiresAt    *Timestamp
}

type LogoutRequest struct {
	RefreshToken string
}

type RefreshTokenRequest struct {
	RefreshToken string
}

type RefreshTokenResponse struct {
	AccessToken  string
	RefreshToken  string
	ExpiresAt    *Timestamp
}

type GetCurrentUserRequest struct{}

type GetCurrentUserResponse struct {
	User *User
}

type Comment struct {
	Id        string
	ArticleId string
	AuthorId  string
	ParentId  string
	Content   string
	CreatedAt *Timestamp
	UpdatedAt *Timestamp
}

type CreateCommentRequest struct {
	ArticleId string
	ParentId  string
	Content   string
}

type CreateCommentResponse struct {
	Comment *Comment
}

type GetCommentRequest struct {
	Id string
}

type GetCommentResponse struct {
	Comment *Comment
}

type UpdateCommentRequest struct {
	Id      string
	Content string
}

type UpdateCommentResponse struct {
	Comment *Comment
}

type DeleteCommentRequest struct {
	Id string
}

type ListCommentsRequest struct {
	ArticleId  string
	ParentId   string
	PageRequest *PageRequest
	SortBy     string
	SortOrder  string
}

type ListCommentsResponse struct {
	Comments     []*Comment
	PageResponse *PageResponse
}

type SearchResultItem struct {
	Article          *Article
	RelevanceScore   float64
	HighlightedSnippet string
}

type SearchArticlesRequest struct {
	Query      string
	PageSize   int32
	PageToken  string
	TopicIds   []string
	TagIds     []string
	AuthorId   string
	SortBy     string
	SortOrder  string
}

type SearchArticlesResponse struct {
	Results     []*SearchResultItem
	TotalMatches int32
}

type Topic struct {
	Id        string
	Name      string
	Slug      string
	CreatedAt *Timestamp
}

type CreateTopicRequest struct {
	Name string
}

type CreateTopicResponse struct {
	Topic *Topic
}

type GetTopicRequest struct {
	Id string
}

type GetTopicResponse struct {
	Topic *Topic
}

type UpdateTopicRequest struct {
	Id        string
	UpdateMask []string
	Name      string
}

type UpdateTopicResponse struct {
	Topic *Topic
}

type DeleteTopicRequest struct {
	Id string
}

type ListTopicsRequest struct {
	PageRequest *PageRequest
	Search      string
	SortBy      string
	SortOrder   string
}

type ListTopicsResponse struct {
	Topics       []*Topic
	PageResponse *PageResponse
}

type Revision struct {
	Id        string
	ArticleId string
	Content   string
	AuthorId  string
	CreatedAt *Timestamp
}

type ListRevisionsRequest struct {
	ArticleId    string
	PageRequest  *PageRequest
	SortOrder    string
}

type ListRevisionsResponse struct {
	Revisions    []*Revision
	PageResponse *PageResponse
}

type GetRevisionRequest struct {
	Id string
}

type GetRevisionResponse struct {
	Revision *Revision
}

type RestoreRevisionRequest struct {
	RevisionId string
	Title      string
}

type RestoreRevisionResponse struct {
	ArticleId   string
	RevisionId  string
	RestoredAt  *Timestamp
}

type ArticleServiceServer interface {
	CreateArticle(context.Context, *CreateArticleRequest) (*CreateArticleResponse, error)
	GetArticle(context.Context, *GetArticleRequest) (*GetArticleResponse, error)
	UpdateArticle(context.Context, *UpdateArticleRequest) (*UpdateArticleResponse, error)
	DeleteArticle(context.Context, *DeleteArticleRequest) (*Empty, error)
	ListArticles(context.Context, *ListArticlesRequest) (*ListArticlesResponse, error)
}

type AuthServiceServer interface {
	Register(context.Context, *RegisterRequest) (*RegisterResponse, error)
	Login(context.Context, *LoginRequest) (*LoginResponse, error)
	Logout(context.Context, *LogoutRequest) (*Empty, error)
	RefreshToken(context.Context, *RefreshTokenRequest) (*RefreshTokenResponse, error)
	GetCurrentUser(context.Context, *GetCurrentUserRequest) (*GetCurrentUserResponse, error)
}

type CommentServiceServer interface {
	CreateComment(context.Context, *CreateCommentRequest) (*CreateCommentResponse, error)
	GetComment(context.Context, *GetCommentRequest) (*GetCommentResponse, error)
	UpdateComment(context.Context, *UpdateCommentRequest) (*UpdateCommentResponse, error)
	DeleteComment(context.Context, *DeleteCommentRequest) (*Empty, error)
	ListComments(context.Context, *ListCommentsRequest) (*ListCommentsResponse, error)
}

type SearchServiceServer interface {
	SearchArticles(context.Context, *SearchArticlesRequest) (*SearchArticlesResponse, error)
}

type TopicServiceServer interface {
	CreateTopic(context.Context, *CreateTopicRequest) (*CreateTopicResponse, error)
	GetTopic(context.Context, *GetTopicRequest) (*GetTopicResponse, error)
	UpdateTopic(context.Context, *UpdateTopicRequest) (*UpdateTopicResponse, error)
	DeleteTopic(context.Context, *DeleteTopicRequest) (*Empty, error)
	ListTopics(context.Context, *ListTopicsRequest) (*ListTopicsResponse, error)
}

type RevisionServiceServer interface {
	ListRevisions(context.Context, *ListRevisionsRequest) (*ListRevisionsResponse, error)
	GetRevision(context.Context, *GetRevisionRequest) (*GetRevisionResponse, error)
	RestoreRevision(context.Context, *RestoreRevisionRequest) (*RestoreRevisionResponse, error)
}

type UnimplementedServer struct{}

func (s *MockServer) CreateArticle(ctx context.Context, req *CreateArticleRequest) (*CreateArticleResponse, error) {
	count := s.incrementCount()
	log.Printf("[CreateArticle] Request #%d: title=%s", count, req.Title)
	if md, ok := metadata.FromIncomingContext(ctx); ok {
		if tags := md.Get("x-mock-tag"); len(tags) > 0 {
			log.Printf("  Mock tag: %s", tags[0])
		}
	}
	return &CreateArticleResponse{
		Article: &Article{
			Id:        fmt.Sprintf("article-%d", count),
			Title:     req.Title,
			Content:   req.Content,
			AuthorId:  "user-1",
			State:     ArticleState_DRAFT,
			ColumnId:  req.ColumnId,
			SeriesId:  req.SeriesId,
			TagIds:    req.TagIds,
			TopicId:   req.TopicId,
			CreatedAt: timestampNow(),
			UpdatedAt: timestampNow(),
		},
	}, nil
}

func (s *MockServer) GetArticle(ctx context.Context, req *GetArticleRequest) (*GetArticleResponse, error) {
	count := s.incrementCount()
	log.Printf("[GetArticle] Request #%d: id=%s", count, req.Id)
	return &GetArticleResponse{
		Article: &Article{
			Id:        req.Id,
			Title:     "Sample Article",
			Content:   "# Sample Content\n\nThis is a test article.",
			AuthorId:  "user-1",
			State:     ArticleState_PUBLISHED,
			TagIds:    []string{"react", "typescript"},
			CreatedAt: timestampNow(),
			UpdatedAt: timestampNow(),
			PublishedAt: timestampNow(),
		},
	}, nil
}

func (s *MockServer) UpdateArticle(ctx context.Context, req *UpdateArticleRequest) (*UpdateArticleResponse, error) {
	count := s.incrementCount()
	log.Printf("[UpdateArticle] Request #%d: id=%s", count, req.Id)
	return &UpdateArticleResponse{
		Article: &Article{
			Id:      req.Id,
			Title:   req.Title,
			Content: req.Content,
			State:   req.State,
			UpdatedAt: timestampNow(),
		},
	}, nil
}

func (s *MockServer) DeleteArticle(ctx context.Context, req *DeleteArticleRequest) (*Empty, error) {
	count := s.incrementCount()
	log.Printf("[DeleteArticle] Request #%d: id=%s", count, req.Id)
	return &Empty{}, nil
}

func (s *MockServer) ListArticles(ctx context.Context, req *ListArticlesRequest) (*ListArticlesResponse, error) {
	count := s.incrementCount()
	log.Printf("[ListArticles] Request #%d: state=%v", count, req.State)
	state := ArticleState_PUBLISHED
	if req.State != 0 {
		state = req.State
	}
	return &ListArticlesResponse{
		Articles: []*Article{
			{Id: "article-1", Title: "Getting Started with React", Content: "# React Tutorial", AuthorId: "user-1", State: state, TagIds: []string{"react", "frontend"}, CreatedAt: timestampNow(), UpdatedAt: timestampNow()},
			{Id: "article-2", Title: "TypeScript Best Practices", Content: "# TypeScript Guide", AuthorId: "user-1", State: state, TagIds: []string{"typescript", "javascript"}, CreatedAt: timestampNow(), UpdatedAt: timestampNow()},
		},
		PageResponse: &PageResponse{NextPageToken: "", HasMore: false, TotalCount: 2},
	}, nil
}

func (s *MockServer) Register(ctx context.Context, req *RegisterRequest) (*RegisterResponse, error) {
	count := s.incrementCount()
	log.Printf("[Register] Request #%d: email=%s", count, req.Email)
	return &RegisterResponse{
		User: &User{Id: "user-new", Email: req.Email, DisplayName: req.DisplayName, Role: UserRole_AUTHOR, CreatedAt: timestampNow()},
		AccessToken: "mock-access-token", RefreshToken: "mock-refresh-token", ExpiresAt: timestampNowPlus(time.Hour),
	}, nil
}

func (s *MockServer) Login(ctx context.Context, req *LoginRequest) (*LoginResponse, error) {
	count := s.incrementCount()
	log.Printf("[Login] Request #%d: email=%s", count, req.Email)
	if req.Email == "invalid@test.com" {
		return nil, fmt.Errorf("invalid credentials")
	}
	return &LoginResponse{
		User: &User{Id: "user-1", Email: req.Email, DisplayName: "Test User", Role: UserRole_AUTHOR, CreatedAt: timestampNow()},
		AccessToken: "mock-access-token", RefreshToken: "mock-refresh-token", ExpiresAt: timestampNowPlus(time.Hour),
	}, nil
}

func (s *MockServer) Logout(ctx context.Context, req *LogoutRequest) (*Empty, error) {
	log.Printf("[Logout] Request")
	return &Empty{}, nil
}

func (s *MockServer) RefreshToken(ctx context.Context, req *RefreshTokenRequest) (*RefreshTokenResponse, error) {
	log.Printf("[RefreshToken] Request")
	return &RefreshTokenResponse{
		AccessToken: "mock-access-token-new", RefreshToken: "mock-refresh-token-new", ExpiresAt: timestampNowPlus(time.Hour),
	}, nil
}

func (s *MockServer) GetCurrentUser(ctx context.Context, req *GetCurrentUserRequest) (*GetCurrentUserResponse, error) {
	log.Printf("[GetCurrentUser] Request")
	return &GetCurrentUserResponse{
		User: &User{Id: "user-1", Email: "test@example.com", DisplayName: "Test User", Role: UserRole_AUTHOR, CreatedAt: timestampNow()},
	}, nil
}

func (s *MockServer) CreateComment(ctx context.Context, req *CreateCommentRequest) (*CreateCommentResponse, error) {
	count := s.incrementCount()
	log.Printf("[CreateComment] Request #%d: articleId=%s", count, req.ArticleId)
	return &CreateCommentResponse{
		Comment: &Comment{Id: fmt.Sprintf("comment-%d", count), ArticleId: req.ArticleId, AuthorId: "user-1", ParentId: req.ParentId, Content: req.Content, CreatedAt: timestampNow(), UpdatedAt: timestampNow()},
	}, nil
}

func (s *MockServer) ListComments(ctx context.Context, req *ListCommentsRequest) (*ListCommentsResponse, error) {
	count := s.incrementCount()
	log.Printf("[ListComments] Request #%d: articleId=%s", count, req.ArticleId)
	return &ListCommentsResponse{
		Comments: []*Comment{{Id: "comment-1", ArticleId: req.ArticleId, AuthorId: "user-1", Content: "Great article!", CreatedAt: timestampNow(), UpdatedAt: timestampNow()}},
		PageResponse: &PageResponse{HasMore: false, TotalCount: 1},
	}, nil
}

func (s *MockServer) UpdateComment(ctx context.Context, req *UpdateCommentRequest) (*UpdateCommentResponse, error) {
	count := s.incrementCount()
	log.Printf("[UpdateComment] Request #%d: id=%s", count, req.Id)
	return &UpdateCommentResponse{
		Comment: &Comment{Id: req.Id, Content: req.Content, UpdatedAt: timestampNow()},
	}, nil
}

func (s *MockServer) DeleteComment(ctx context.Context, req *DeleteCommentRequest) (*Empty, error) {
	count := s.incrementCount()
	log.Printf("[DeleteComment] Request #%d: id=%s", count, req.Id)
	return &Empty{}, nil
}

func (s *MockServer) SearchArticles(ctx context.Context, req *SearchArticlesRequest) (*SearchArticlesResponse, error) {
	count := s.incrementCount()
	log.Printf("[SearchArticles] Request #%d: query=%s", count, req.Query)
	query := strings.ToLower(req.Query)
	var results []*SearchResultItem
	if strings.Contains(query, "react") || query == "" {
		results = append(results, &SearchResultItem{Article: &Article{Id: "article-1", Title: "Getting Started with React", AuthorId: "user-1", State: ArticleState_PUBLISHED, TagIds: []string{"react"}}, RelevanceScore: 0.95, HighlightedSnippet: "<mark>React</mark> is a popular library for building UIs."})
	}
	if strings.Contains(query, "typescript") || query == "" {
		results = append(results, &SearchResultItem{Article: &Article{Id: "article-2", Title: "TypeScript Best Practices", AuthorId: "user-1", State: ArticleState_PUBLISHED, TagIds: []string{"typescript"}}, RelevanceScore: 0.85, HighlightedSnippet: "<mark>TypeScript</mark> adds static typing to JavaScript."})
	}
	return &SearchArticlesResponse{Results: results, TotalMatches: int32(len(results))}, nil
}

func (s *MockServer) CreateTopic(ctx context.Context, req *CreateTopicRequest) (*CreateTopicResponse, error) {
	count := s.incrementCount()
	log.Printf("[CreateTopic] Request #%d: name=%s", count, req.Name)
	return &CreateTopicResponse{
		Topic: &Topic{Id: fmt.Sprintf("topic-%d", count), Name: req.Name, Slug: strings.ReplaceAll(strings.ToLower(req.Name), " ", "-"), CreatedAt: timestampNow()},
	}, nil
}

func (s *MockServer) GetTopic(ctx context.Context, req *GetTopicRequest) (*GetTopicResponse, error) {
	log.Printf("[GetTopic] Request: id=%s", req.Id)
	return &GetTopicResponse{
		Topic: &Topic{Id: req.Id, Name: "Technology", Slug: "technology"},
	}, nil
}

func (s *MockServer) UpdateTopic(ctx context.Context, req *UpdateTopicRequest) (*UpdateTopicResponse, error) {
	log.Printf("[UpdateTopic] Request: id=%s", req.Id)
	return &UpdateTopicResponse{
		Topic: &Topic{Id: req.Id, Name: req.Name, Slug: strings.ReplaceAll(strings.ToLower(req.Name), " ", "-")},
	}, nil
}

func (s *MockServer) DeleteTopic(ctx context.Context, req *DeleteTopicRequest) (*Empty, error) {
	log.Printf("[DeleteTopic] Request: id=%s", req.Id)
	return &Empty{}, nil
}

func (s *MockServer) ListTopics(ctx context.Context, req *ListTopicsRequest) (*ListTopicsResponse, error) {
	count := s.incrementCount()
	log.Printf("[ListTopics] Request #%d", count)
	return &ListTopicsResponse{
		Topics: []*Topic{{Id: "topic-1", Name: "Technology", Slug: "technology"}, {Id: "topic-2", Name: "Tutorial", Slug: "tutorial"}, {Id: "topic-3", Name: "Opinion", Slug: "opinion"}},
	}, nil
}

func (s *MockServer) ListRevisions(ctx context.Context, req *ListRevisionsRequest) (*ListRevisionsResponse, error) {
	count := s.incrementCount()
	log.Printf("[ListRevisions] Request #%d: articleId=%s", count, req.ArticleId)
	return &ListRevisionsResponse{
		Revisions: []*Revision{{Id: "rev-1", ArticleId: req.ArticleId, Content: "# Original Content", AuthorId: "user-1", CreatedAt: timestampNow()}},
	}, nil
}

func (s *MockServer) GetRevision(ctx context.Context, req *GetRevisionRequest) (*GetRevisionResponse, error) {
	count := s.incrementCount()
	log.Printf("[GetRevision] Request #%d: id=%s", count, req.Id)
	return &GetRevisionResponse{
		Revision: &Revision{Id: req.Id, Content: "# Historical Content", AuthorId: "user-1", CreatedAt: timestampNow()},
	}, nil
}

func (s *MockServer) RestoreRevision(ctx context.Context, req *RestoreRevisionRequest) (*RestoreRevisionResponse, error) {
	count := s.incrementCount()
	log.Printf("[RestoreRevision] Request #%d: revisionId=%s", count, req.RevisionId)
	return &RestoreRevisionResponse{
		ArticleId: "article-restored", RevisionId: req.RevisionId, RestoredAt: timestampNow(),
	}, nil
}