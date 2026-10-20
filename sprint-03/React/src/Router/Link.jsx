import { useLocation } from "./router";

/**
 * Link interno da aplicação. Gera um <a href="#/rota"> comum, então
 * funciona com abrir em nova aba, copiar link e leitores de tela.
 * Com activeClassName, marca o link da página atual (usado no menu).
 */
export default function Link({ to, className = "", activeClassName, children, ...rest }) {
  const { pathname } = useLocation();
  const targetPath = to.split("?")[0];
  const isActive = activeClassName && pathname === targetPath;

  return (
    <a
      href={`#${to}`}
      className={[className, isActive ? activeClassName : ""].filter(Boolean).join(" ") || undefined}
      aria-current={isActive ? "page" : undefined}
      {...rest}
    >
      {children}
    </a>
  );
}
