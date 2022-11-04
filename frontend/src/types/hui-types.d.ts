export {};

declare global {
  interface RouteType {
    name: string;
    layout: string;
    component: () => JSX.Element;
    icon?: JSX.Element;
    showNavbar?: boolean;
    buttonComponent?: (isActive: boolean, route: RouteType) => JSX.Element;
    path: string;
    activeOnPath?: string[];
  }
}
