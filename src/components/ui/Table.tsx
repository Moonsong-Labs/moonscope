import { LinkedTableCellProps } from "../../types/table";

export const LinkedTableCell = ({ href, children }: LinkedTableCellProps) => (
	<td>
		<a href={href}>{children}</a>
	</td>
);
