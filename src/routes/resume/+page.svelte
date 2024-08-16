<script>
  const experiences = $state([
    {
      title: "Senior Software Engineer",
      company: "Ama Multimedia LLC",
      period: "2023-11 - Present, Salt Lake City, UT",
      description:
        "At Ama Multimedia, I spearheaded the creation of a unified Vue UI library, enhancing consistency across multiple product lines including streaming and content hosting sites. I successfully split a monolithic streaming application into separate user-facing and backend components, significantly improving maintainability and performance. Additionally, I refactored the JavaScript portion of a large Ruby on Rails application, resulting in a 50% reduction in build times.",
    },
    {
      title: "Senior Software Engineer",
      company: "Impartner Software",
      period: "2022-02 - 2022-11, Salt Lake City, UT",
      description:
        "During my tenure at Impartner Software, I focused on enhancing the company's partner relationship management (PRM) solutions. I worked on improving the scalability and performance of the core platform, implementing new features to streamline partner onboarding processes, and optimizing data synchronization between Impartner's PRM and clients' CRM systems.",
    },
    {
      title: "Senior Software Engineer",
      company: "Purple",
      period: "2021-11 - 2022-02, Salt Lake City, UT",
      description:
        "At Purple, I developed a crucial 'tag router' AWS Lambda function, effectively offloading hundreds of advertising tags from the client to the server. This innovation significantly enhanced client-side performance, improving load times and user experience on Purple's e-commerce platform. I also collaborated with the marketing team to implement more efficient tracking and analytics solutions.",
    },
    {
      title: "Principle Software Engineer",
      company: "TruVision Health",
      period: "2020-08 - 2021-10, Salt Lake City, UT",
      description:
        "As the Principle Software Engineer at TruVision Health, I led a comprehensive optimization effort that resulted in a 600% increase in main site speed. This was achieved through a combination of server response time optimization, implementation of lazy loading techniques, and reduction of redundant JavaScript. I also played a key role in mentoring junior developers, significantly improving their coding skills and contributions to projects.",
    },
    {
      title: "Senior Software Engineer",
      company: "NeuraLegion",
      period: "2018-08 - 2019-11, Remote",
      description:
        "At NeuraLegion, I contributed to the development of advanced AI-powered security testing solutions. I worked on improving the accuracy and efficiency of automated vulnerability scanning tools, implemented new features for detecting complex web application vulnerabilities, and collaborated with the research team to incorporate the latest security threat intelligence into our products.",
    },
    {
      title: "Software Engineer",
      company: "Pando Development",
      period: "2016-10 - 2019-02, Salt Lake City, UT",
      description:
        "During my time at Pando Development, I was involved in building robust file sharing and collaboration tools. I contributed to the development of a secure, distributed file system, implemented real-time collaboration features, and worked on optimizing large file transfer protocols to enhance user experience and system reliability.",
    },
    {
      title: "Associate Consultant",
      company: "Cloud Software LLC",
      period: "2016-02 - 2016-10, Salt Lake City, UT",
      description:
        "As an Associate Consultant at Cloud Software LLC, I provided technical expertise to clients transitioning to cloud-based solutions. I assisted in the migration of legacy systems to modern cloud platforms, developed custom integrations between various cloud services, and provided training to client teams on best practices for cloud architecture and security.",
    },
    {
      title: "QA Engineer",
      company: "NUVI",
      period: "2015-02 - 2015-08, Orem, UT",
      description:
        "At NUVI, I was responsible for ensuring the quality and reliability of social media analytics tools. I developed and executed comprehensive test plans, automated repetitive testing processes, and worked closely with developers to resolve identified issues. My efforts contributed to improving the overall stability and user satisfaction of NUVI's products.",
    },
    {
      title: "Web Developer",
      company: "Utah Valley University",
      period: "2014-08 - 2015-02, Orem, UT",
      description:
        "As a Web Developer at Utah Valley University, I contributed to the maintenance and improvement of the university's web presence. I developed and updated various departmental websites, implemented responsive design principles to enhance mobile accessibility, and collaborated with content owners to ensure accurate and timely information updates across the university's web properties.",
    },
  ]);

  const skills = $state([
    "JavaScript",
    "TypeScript",
    "NodeJS",
    "Deno",
    "Ruby",
    "Crystal",
    "Python",
    "Golang",
    "HTML5",
    "CSS3",
    "LESS",
    "SASS",
    "Stylus",
    "Vue 3",
    "Angular",
    "React",
    "Svelte",
    "SQL",
    "PostgreSQL",
    "SQLite",
    "MySQL",
    "Supabase",
    "Firebase",
    "MongoDB",
    "Redis",
    "Ruby on Rails",
    "Laravel",
    "Lucky",
    "Amber",
    "Sinatra",
    "Kemal",
    "Flask",
    "Docker",
    "AWS",
    "Git",
    "CI/CD",
    "Agile",
  ]);
</script>

<div class="space-y-8">
  <section>
    <h1 class="text-3xl font-bold mb-2">Christopher Watson</h1>
    <p class="text-xl text-teal-400 mb-2">
      Senior Software Engineer - Salt Lake City, UT
    </p>
    <p class="text-sm">
      <a href="mailto:chris@watzon.tech" class="text-teal-400 hover:underline"
        >chris@watzon.tech</a
      >
      •
      <a
        href="https://linkedin.com/in/watzon1993"
        target="_blank"
        rel="noopener noreferrer"
        class="text-teal-400 hover:underline">LinkedIn</a
      >
      •
      <a
        href="https://github.com/watzon"
        target="_blank"
        rel="noopener noreferrer"
        class="text-teal-400 hover:underline">GitHub</a
      >
    </p>
  </section>

  <section class="mb-6">
    <p class="mb-4">
      In the ever-evolving landscape of software engineering, I've spent over a decade crafting digital solutions that push the boundaries of what's possible. My journey has been guided by the wisdom of Linus Torvalds, who said, "Talk is cheap. Show me the code." And that's exactly what I've done.
    </p>
    <p>
      From optimizing site speeds by 600% to architecting scalable web applications, I've consistently turned complex challenges into elegant solutions. My expertise lies in full-stack development, with a particular passion for harnessing the power of modern JavaScript technologies. I don't just write code; I build digital experiences that make a difference.
    </p>
  </section>

  <section>
    <h2 class="text-2xl font-bold mb-4">Experience</h2>
    {#each experiences as job}
      <div class="mb-6">
        <h3 class="text-lg font-semibold">{job.title} - {job.company}</h3>
        <p class="text-sm text-gray-400 mb-2">{job.period}</p>
        <p class="text-sm">{job.description}</p>
      </div>
    {/each}
  </section>

  <section>
    <h2 class="text-2xl font-bold mb-4">Skills</h2>
    <div class="flex flex-wrap gap-2">
      {#each skills as skill}
        <span class="bg-gray-700 text-teal-400 px-2 py-1 rounded text-sm"
          >{skill}</span
        >
      {/each}
    </div>
  </section>

  <section>
    <h2 class="text-2xl font-bold mb-4">Awards and Honors</h2>
    <p>Eagle Scout • 2011</p>
  </section>
</div>
