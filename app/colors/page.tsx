export default function ColorsPage(): React.JSX.Element {
	return (
		<div className="container mx-auto mt-12 bg-base-300 p-8 dark:bg-base-300">
			<div className="grid grid-cols-3 gap-2 text-center font-bold text-xl [--cell-height:--spacing(12)]">
				<div className="h-(--cell-height) rounded-xl border bg-base-100 text-dark-100 leading-(--cell-height)">
					base-100
				</div>
				<div className="h-(--cell-height) rounded-xl border bg-base-200 text-dark-100 leading-(--cell-height)">
					base-200
				</div>
				<div className="h-(--cell-height) rounded-xl border bg-base-300 text-dark-100 leading-(--cell-height)">
					base-300
				</div>
				<div className="h-(--cell-height) rounded-xl border bg-dark-100 text-base-100 leading-(--cell-height)">
					dark-100
				</div>
				<div className="h-(--cell-height) rounded-xl border bg-dark-200 text-base-100 leading-(--cell-height)">
					dark-200
				</div>
				<div className="h-(--cell-height) rounded-xl border bg-dark-300 text-base-100 leading-(--cell-height)">
					dark-300
				</div>
				<div className="h-(--cell-height) rounded-xl border bg-primary text-base-100 leading-(--cell-height)">
					primary
				</div>
				<div className="h-(--cell-height) rounded-xl border bg-secondary text-base-100 leading-(--cell-height)">
					secondary
				</div>
				<div className="h-(--cell-height) rounded-xl border bg-neutral text-base-100 leading-(--cell-height)">
					neutral
				</div>
				<div className="col-span-3 h-(--cell-height) rounded-xl border bg-accent leading-(--cell-height)">
					accent
				</div>
				<div className="col-span-3 h-(--cell-height) rounded-xl border bg-info leading-(--cell-height)">
					info
				</div>
				<div className="col-span-3 h-(--cell-height) rounded-xl border bg-success leading-(--cell-height)">
					success
				</div>
				<div className="col-span-3 h-(--cell-height) rounded-xl border bg-warning leading-(--cell-height)">
					warning
				</div>
				<div className="col-span-3 h-(--cell-height) rounded-xl border bg-error leading-(--cell-height)">
					error
				</div>
			</div>
		</div>
	);
}
