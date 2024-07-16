import { routes } from "configs";

// Layouts
import { MainLayout, AuthLayout } from "layouts";

// Pages
import {
  HomePage,
  PostsListPage,
  PostDetailPage,
  CreatePostPage,
  AuthPage,
  AccountListPage,
  AccountDetailPage,
  BannerPage,
  ThemePage,
  ChatPage,
  NotPermissionPage,
  WorkerManagerPage,
  WorkerDetailPage,
  CategoryPage,
  CategoryDetailPage,
  AllChildCategoryPage,
  ChildCategoryDetailPage,
  CreateChildCategoryPage,
  CreateParentCategoryPage,
  AdminSuggestManagerPage,
  SuggestDetailPage,
  CreateSearchSuggestPage,
  AdminLanguageManagerPage,
  AdminCommunityManagerPage,
  AdminCommunityCreatePage,
  AdminCommunityDetailPage,
  // Serivce Manager
  AdminServiceManagerPage,
  AdminServiceCreatePage,
  ServiceDetailPage,
} from "pages";
import Analytics from "pages/Analytics/Analytics";
import AdminCommunityHistoryManagerPage from "pages/Community/AdminCommunityHistory";
import Company from "pages/Company";
import CompanyDetail from "pages/Company/CompanyDetail";
import DetailHotMangager from "pages/Hot/DetailHotMangager";
import HotHistoryManager from "pages/Hot/HotHistoryManager";
import HotManager from "pages/Hot/HotManager";
import PostsHistoryListPage from "pages/Post/PostHistoryList";
import SendMailPage from "pages/SendMail/SendMail";
import ServiceHistoryManager from "pages/ServiceManager/ServiceHistoryManager";
import UserPointManager from "pages/UserPoint/UserPointManager";

const publicRoutes = [
  {
    path: "/",
    component: HomePage,
    layout: MainLayout,
  },
  {
    path: routes.analytics,
    component: Analytics,
    layout: MainLayout,
  },
  {
    path: routes.home,
    component: HomePage,
    layout: MainLayout,
  },
  {
    path: routes.postsList,
    component: PostsListPage,
    layout: MainLayout,
  },
  {
    path: routes.postDetail,
    component: PostDetailPage,
    layout: MainLayout,
  },
  {
    path: routes.createPost,
    component: CreatePostPage,
    layout: MainLayout,
  },
  {
    path: routes.accountList,
    component: AccountListPage,
    layout: MainLayout,
  },
  {
    path: routes.accountDetail,
    component: AccountDetailPage,
    layout: MainLayout,
  },
  {
    path: routes.banner,
    component: BannerPage,
    layout: MainLayout,
  },
  {
    path: routes.themeCategory,
    component: ThemePage,
    layout: MainLayout,
  },
  {
    path: routes.chat,
    component: ChatPage,
    layout: MainLayout,
  },
  {
    path: routes.notPermission,
    component: NotPermissionPage,
    layout: MainLayout,
  },
  {
    path: routes.workerManager,
    component: WorkerManagerPage,
    layout: MainLayout,
  },
  {
    path: routes.workerDetail,
    component: WorkerDetailPage,
    layout: MainLayout,
  },
  {
    path: routes.auth,
    component: AuthPage,
    layout: AuthLayout,
  },
  {
    path: routes.category,
    component: CategoryPage,
    layout: MainLayout,
  },
  {
    path: routes.categoryDetail,
    component: CategoryDetailPage,
    layout: MainLayout,
  },
  {
    path: routes.seeAllChildCategory,
    component: AllChildCategoryPage,
    layout: MainLayout,
  },
  {
    path: routes.childCategoryDetail,
    component: ChildCategoryDetailPage,
    layout: MainLayout,
  },
  {
    path: routes.createChildCategory,
    component: CreateChildCategoryPage,
    layout: MainLayout,
  },
  {
    path: routes.createParentCategory,
    component: CreateParentCategoryPage,
    layout: MainLayout,
  },
  {
    path: routes.suggestDetail,
    component: SuggestDetailPage,
    layout: MainLayout,
  },
  {
    path: routes.adminSuggestManager,
    component: AdminSuggestManagerPage,
    layout: MainLayout,
  },
  {
    path: routes.createSearchSuggest,
    component: CreateSearchSuggestPage,
    layout: MainLayout,
  },
  {
    path: routes.sendMail,
    component: SendMailPage,
    layout: MainLayout,
  },
  {
    path: routes.language,
    component: AdminLanguageManagerPage,
    layout: MainLayout,
  },
  {
    path: routes.communityManager,
    component: AdminCommunityManagerPage,
    layout: MainLayout,
  },
  {
    path: routes.createCommunity,
    component: AdminCommunityCreatePage,
    layout: MainLayout,
  },
  {
    path: routes.communityDetail,
    component: AdminCommunityDetailPage,
    layout: MainLayout,
  },
  // Serivce Manager
  {
    path: routes.serviceManager,
    component: AdminServiceManagerPage,
    layout: MainLayout,
  },
  {
    path: routes.createService,
    component: AdminServiceCreatePage,
    layout: MainLayout,
  },
  {
    path: routes.detailService,
    component: ServiceDetailPage,
    layout: MainLayout,
  },
  {
    path: routes.companyManager,
    component: Company,
    layout: MainLayout,
  },
  {
    path: routes.companyDetail,
    component: CompanyDetail,
    layout: MainLayout,
  },
  {
    path: routes.hotManager,
    component: HotManager,
    layout: MainLayout,
  },
  {
    path: routes.hotDetail,
    component: DetailHotMangager,
    layout: MainLayout,
  },
  {
    path: routes.userPointHistory,
    component: UserPointManager,
    layout: MainLayout,
  },
  {
    path: routes.historiesDelete,
    component: AdminCommunityHistoryManagerPage,
    layout: MainLayout,
  },
  {
    path: routes.hotHistory,
    component: HotHistoryManager,
    layout: MainLayout,
  },
  {
    path: routes.serviceHistory,
    component: ServiceHistoryManager,
    layout: MainLayout,
  },
  {
    path: routes.postHistoryList,
    component: PostsHistoryListPage,
    layout: MainLayout,
  },
];

export { publicRoutes };
