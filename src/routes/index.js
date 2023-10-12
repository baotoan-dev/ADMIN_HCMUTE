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
  AdminCommunityDetailPage
} from "pages";
import SendMailPage from "pages/SendMail/SendMail";

const publicRoutes = [
  {
    path: "/",
    component: HomePage,
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
    layout: MainLayout
  }, 
  {
    path: routes.createParentCategory,
    component: CreateParentCategoryPage,
    layout: MainLayout
  },
  {
    path: routes.suggestDetail,
    component: SuggestDetailPage,
    layout: MainLayout
  },
  {
    path: routes.adminSuggestManager,
    component: AdminSuggestManagerPage,
    layout: MainLayout
  },
  {
    path: routes.createSearchSuggest,
    component: CreateSearchSuggestPage,
    layout: MainLayout
  },
  {
    path: routes.sendMail,
    component: SendMailPage,
    layout: MainLayout
  },
  {
    path: routes.language,
    component: AdminLanguageManagerPage,
    layout: MainLayout
  },
  {
    path: routes.communityManager,
    component: AdminCommunityManagerPage,
    layout: MainLayout
  },
  {
    path: routes.createCommunity,
    component: AdminCommunityCreatePage,
    layout: MainLayout
  },
  {
    path: routes.communityDetail,
    component: AdminCommunityDetailPage,
    layout: MainLayout
  }
];

export { publicRoutes };
