const routes = {
  // COMMON
  auth: "/admin/auth",

  // ADMIN
  home: "/admin",
  postsList: "/admin/posts",
  postDetail: "/admin/posts/:id",
  createPost: "/admin/posts/create",
  accountList: "/admin/accounts",
  accountDetail: "/admin/accounts/:id",
  banner: "/admin/banners",
  themeCategory: "/admin/themes",
  chat: "/admin/chats",
  workerManager: "/admin/worker-manager",
  workerDetail: "/admin/worker-manager/detail",
  notPermission: "/admin/not-permission",
  category: "/admin/category-manager",
  categoryDetail: "/admin/category-manager/:id",
  seeAllChildCategory: "/admin/see-all-child-category/:id",
  childCategoryDetail: "/admin/child-category/:id",
  createChildCategory: "/admin/:id/create-child-category",
  createParentCategory: "/admin/create-parent-category",
  adminSuggestManager: "/admin/search-suggest",
  suggestDetail:"/admin/search-suggest/:id",
  createSearchSuggest: "/admin/create-search-suggest",
  language: "/admin/language-manager",
  createCommunity: "/admin/community-create",
  communityManager: "/admin/community-manager",
  communityDetail: "/admin/community-detail/:id",
  sendMail: "/admin/send-mail",
};

export default routes;
