import Link from "../../Router/Link";

/**
 * Item de menu que sabe em qual área React está.
 * Dentro da própria área usa o Link interno (rota por hash, sem recarregar);
 * para outra área ou página HTML usa um <a> comum.
 */
export default function NavItem({ internal, to, href, children, ...rest }) {
  if (internal) {
    return (
      <Link to={to} activeClassName="active" {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} {...rest}>
      {children}
    </a>
  );
}
