/** MDX element styles for the legal pages. Pass to <Content components={legalMdx} />. */
import Heading from "./Heading.astro";
import Link from "./Link.astro";
import List from "./List.astro";
import ListItem from "./ListItem.astro";
import Paragraph from "./Paragraph.astro";

export const legalMdx = { h2: Heading, p: Paragraph, ul: List, li: ListItem, a: Link };
