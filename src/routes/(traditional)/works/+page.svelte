<script lang="ts">
	import { works } from '$lib/works';
	const worksArr: any[] = Object.entries(works).reverse();
</script>

<!-- Hero -->
<header class="text-center py-10 md:py-20">
	<div class="text-center space-y-2 drop-shadow-lg">
		<img src="/images/logo.png" class="animFloat mx-auto" alt="logo" />
		<span class="block text-5xl md:text-7xl lg:text-9xl">Hi, I'm <span class="text-primary-500 font-bold">Ryan</span></span>
		<span class="block text-xs md:text-lg font-bold opacity-75 drop-shadow-xl md:translate-x-12">
			Developer, musician, athlete, and more.
		</span>
	</div>
</header>

<!-- Works -->
<section class="space-y-10">
	{#each worksArr as [key, work]}
		<div>
			<!-- Label -->
			<h2 class="section-header">{work.label}</h2>
			<!-- Projects Grid -->
			<div class="grid grid-cols-2 md:grid-cols-4 gap-1">
				<!-- Project -->
				{#each work.projects as project}
					<a
						href={`./works/${key}/${project.id}`}
						class="unstyled aspect-square overflow-hidden shadow group"
						style:background-color={project.accent}
					>
						<img
							class="w-full aspect-square transition-all duration-[150] group-hover:-translate-y-full"
							src={project.thumbnail}
							alt="thumbnail"
						/>
						<div class="w-full h-full flex justify-center items-center group-hover:-translate-y-full cursor-pointer">
							<span class="text-white font-bold text-xl drop-shadow-xl">{project.name}</span>
						</div>
					</a>
				{/each}
			</div>
		</div>
	{/each}
</section>
