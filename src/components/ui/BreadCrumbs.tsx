const HomeCrumb = () => (
	<li class="mr-5 glass rounded drop-shadow-md inline-block p-2 text-shadow font-bold">
		<a href="/"> 🗄️ Home</a>
	</li>
);

const SuiteCrumb = ({ reportType }: { reportType: string }) => (
	<li class="mr-5 glass rounded drop-shadow-md inline-block p-2 text-shadow font-bold">
		<a href={`/${reportType}`}>🗃️ {reportType.toLocaleUpperCase()}</a>
	</li>
);

const RunSummary = ({
	id,
	reportType,
}: { id: string; reportType?: string }) => (
	<li class="mr-5 glass rounded drop-shadow-md inline-block p-2 text-shadow font-bold">
		<a href={`/${reportType}/${id}`}> 📁 Test Run #{id}</a>
	</li>
);

const RunExpanded = ({
	expandTest,
	reportType,
	id,
}: { expandTest: string; reportType: string; id: string }) => (
	<li class="mr-5 glass rounded drop-shadow-md inline-block p-2 text-shadow font-bold">
		<a href={`/${reportType}/${id}/${expandTest}`}>
			{" "}
			📂 Expanded #{expandTest}
		</a>
	</li>
);

export const CrumbBuilder = ({
	reportType,
	runId,
	expandTest,
}: {
	reportType?: string;
	runId?: string;
	expandTest?: string;
}) => (
	<div class="text-l breadcrumbs ml-2 mb-5">
		<ul>
			<HomeCrumb />
			{reportType && <SuiteCrumb reportType={reportType} />}
			{runId && <RunSummary id={runId} reportType={reportType} />}
			{expandTest && (
				<RunExpanded
					reportType={reportType || "error"}
					id={runId || "error"}
					expandTest={expandTest}
				/>
			)}
		</ul>
	</div>
);
