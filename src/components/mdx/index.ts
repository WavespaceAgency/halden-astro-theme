/**
 * MDX element styles for blog posts. Pass to <Content components={blogMdx} />.
 * Quote and Stats can be used in any post without an import.
 */
import Heading from "./Heading.astro";
import List from "./List.astro";
import ListItem from "./ListItem.astro";
import Paragraph from "./Paragraph.astro";
import Quote from "./Quote.astro";
import Stats from "./Stats.astro";

export const blogMdx = {
  h2: Heading,
  p: Paragraph,
  ul: List,
  li: ListItem,
  Quote,
  Stats,
};
