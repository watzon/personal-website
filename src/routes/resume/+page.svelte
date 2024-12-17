<script>
  const experiences = $state([
    {
      title: "Full Stack Software Engineer",
      company: "Ama Multimedia LLC",
      period: "2022-12 - 2024-03 • Remote",
      description: "Led frontend and backend development using TypeScript, Node.js, and Go for high-traffic streaming platforms serving 1M+ monthly active users.",
      highlights: [
        "Architected and implemented a TypeScript/Vue.js component library used across 5 product lines, reducing development time by 40%",
        "Led migration from monolithic to microservices architecture using TypeScript and Node.js, improving deployment frequency by 300%",
        "Optimized build pipeline using TypeScript and Webpack, reducing build times from 15 minutes to 7 minutes"
      ]
    },
    {
      title: "Full Stack Software Engineer",
      company: "Impartner Software",
      period: "2022-02 - 2022-11 • Lehi, UT",
      description: "Developed and maintained enterprise PRM solutions using TypeScript, React, and Node.js, supporting 200+ enterprise clients.",
      highlights: [
        "Built scalable microservices using TypeScript and Node.js, handling 500K+ daily API requests",
        "Developed real-time data synchronization system using TypeScript and WebSockets, reducing sync times by 60%",
        "Implemented automated testing suite with Jest and TypeScript, achieving 85% code coverage"
      ]
    },
    {
      title: "Full Stack Software Engineer",
      company: "Purple",
      period: "2021-11 - 2022-02 • Lehi, UT",
      description: "Enhanced e-commerce platform serving $500M+ annual revenue using TypeScript, React, and Node.js.",
      highlights: [
        "Engineered AWS Lambda functions using TypeScript, processing 1M+ daily advertising events",
        "Reduced page load time from 8s to 2s through TypeScript-based server-side optimizations",
        "Implemented A/B testing framework using TypeScript, leading to 15% conversion rate improvement"
      ]
    },
    {
      title: "Lead Software Engineer",
      company: "TruVision Health",
      period: "2020-08 - 2021-10 • Draper, UT",
      description: "Led 8-person engineering team, focusing on TypeScript and Node.js development for e-commerce platform.",
      highlights: [
        "Spearheaded site optimization using TypeScript and React, improving load times by 600%",
        "Established TypeScript coding standards and review processes, reducing bug reports by 40%",
        "Implemented CI/CD pipeline using GitHub Actions and TypeScript, reducing deployment time by 70%"
      ]
    },
    {
      title: "Senior Software Engineer",
      company: "NeuraLegion",
      period: "2018-08 - 2019-11 • Remote",
      description: "Developed security testing automation tools using TypeScript and Node.js for enterprise clients.",
      highlights: [
        "Built browser automation engine using TypeScript and Puppeteer, improving scan speed by 50%",
        "Developed vulnerability detection algorithms using TypeScript, identifying 30% more security issues",
        "Created REST API using TypeScript and Express.js, handling 100K+ daily requests"
      ]
    }
  ]);

  const technicalSkills = $state({
    "Programming Languages": [
      "TypeScript (5+ years)",
      "Go (3+ years)",
      "JavaScript (10+ years)",
      "Python (3+ years)",
      "Ruby (3+ years)"
    ],
    "Frontend Development": [
      "React.js",
      "Vue.js",
      "Svelte",
      "Webpack",
      "Tailwind CSS",
      "HTML5/CSS3"
    ],
    "Backend Development": [
      "Node.js",
      "Express.js",
      "Go HTTP",
      "Ruby on Rails",
      "RESTful APIs",
      "GraphQL"
    ],
    "Cloud & DevOps": [
      "AWS (EC2, Lambda, S3)",
      "Docker",
      "Kubernetes",
      "CI/CD",
      "GitHub Actions",
      "Jenkins"
    ],
    "Databases & Storage": [
      "PostgreSQL",
      "MongoDB",
      "Redis",
      "Elasticsearch"
    ]
  });

  const projects = $state([
    {
      name: "0x45 File Sharing Platform",
      description: "High-performance file sharing service processing 10K+ daily uploads. Built with Go, featuring concurrent processing and efficient memory management.",
      link: "https://github.com/watzon/0x45",
      technologies: ["Go", "Redis", "PostgreSQL", "Docker", "AWS S3"]
    },
    {
      name: "Goshot Code Screenshot Tool",
      description: "CLI application with 1K+ GitHub stars that generates code screenshots. Implemented in Go with focus on performance and memory efficiency.",
      link: "https://github.com/watzon/goshot",
      technologies: ["Go", "Image Processing"]
    },
    {
      name: "PostPilot SMTP Testing Tool",
      description: "Local SMTP testing solution used by 500+ developers. Built with Go, featuring real-time WebSocket notifications and REST API.",
      link: "https://github.com/watzon/postpilot",
      technologies: ["Go", "SMTP", "React", "Wails"]
    }
  ]);

  const education = $state({
    school: "Utah Valley University",
    degree: "Computer Science",
    period: "2014-2015",
    description: "Coursework: Data Structures, Algorithms, Software Engineering, Computer Architecture"
  });
</script>

<svelte:head>
  <meta property="og:type" content="article">
  <meta property="og:url" content="https://watzon.tech/resume">
  <meta property="og:title" content="Chris Watson - Full Stack Software Engineer">
  <meta property="og:description" content="Senior Software Engineer specializing in TypeScript and Go development">
  <meta property="og:image" content="https://watzon.tech/images/og-image.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Chris Watson - Full Stack Software Engineer">
  <meta property="og:site_name" content="watzon.tech">
  <style>
    @page {
      margin: 0.4in;
      size: auto;
      marks: none;
    }
    @media print {
      html {
        height: 100%;
        font-family: Arial, Helvetica, sans-serif;
      }
      body {
        height: 100%;
        line-height: 1.2;
      }
    }
  </style>
</svelte:head>

<style>
  @media print {
    :global(header),
    :global(footer),
    :global(.dark-mode-toggle) {
      display: none !important;
    }

    :global(body),
    :global(.dark),
    :global(.dark .dark\:bg-gray-900),
    :global(.bg-orange-50) {
      background: white !important;
      color: black !important;
      font-family: Arial, Helvetica, sans-serif !important;
    }

    :global(.prose) {
      max-width: none !important;
      padding: 0 !important;
      margin: 0 !important;
    }

    h2 {
      font-size: 18px !important;
      margin-bottom: 2px !important;
      text-transform: uppercase !important;
    }

    h3 {
      font-size: 16px !important;
      margin-bottom: 2px !important;
      text-transform: uppercase !important;
    }

    h4 {
      font-size: 14px !important;
      margin-bottom: 2px !important;
    }

    p {
      font-size: 12px !important;
      line-height: 1.3 !important;
      margin-bottom: 6px !important;
    }

    .skills-section {
      display: block;
      margin: 0 0 1px 0;
    }

    .skills-category {
      font-size: 11px !important;
      font-weight: bold;
    }

    .skills-list {
      display: inline;
      margin: 0 !important;
      padding: 0 !important;
      list-style: none !important;
    }

    .skills-list li {
      display: inline;
      font-size: 11px !important;
      line-height: 1.1 !important;
      margin: 0 !important;
    }

    .skills-list li:not(:last-child)::after {
      content: ", ";
      color: #666;
    }

    section {
      page-break-inside: auto;
    }

    .job-item {
      page-break-inside: avoid;
      margin-bottom: 12px !important;
    }

    a {
      color: #333 !important;
      text-decoration: none !important;
    }

    a[href^="http"]::after {
      content: " (" attr(href) ")";
      font-size: 10px;
      color: #666;
    }

    .highlights-list {
      margin: 4px 0 0 0 !important;
      padding-left: 16px !important;
    }

    .highlights-list li {
      font-size: 11px !important;
      line-height: 1.3 !important;
      margin-bottom: 1px !important;
      page-break-inside: avoid;
    }

    .project-item {
      page-break-inside: avoid;
      margin-bottom: 8px !important;
    }

    .project-technologies {
      font-size: 10px !important;
      color: #666 !important;
      margin-top: 2px !important;
    }

    .contact-info {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      align-items: center;
    }

    .contact-info a,
    .contact-info span {
      white-space: nowrap;
    }

    .contact-info .bullet {
      color: #666;
    }
  }
</style>

<div class="prose prose-xl max-w-full dark:prose-invert">
  <section>
    <h2 class="!mt-0 !mb-2">CHRISTOPHER WATSON</h2>
    <h4 class="!mt-0 !mb-2">
      Full Stack Software Engineer • Salt Lake City, UT
    </h4>
    <p class="!text-sm !mb-6 contact-info">
      <a href="mailto:chris@watzon.tech" class="text-teal-600 dark:text-teal-400 hover:underline"
        >chris@watzon.tech</a
      >
      <span class="bullet">•</span>
      <a
        href="tel://18018362322"
        target="_blank"
        rel="noopener noreferrer"
        class="text-teal-600 dark:text-teal-400 hover:underline">801-555-0123</a>
      <span class="bullet">•</span>
      <a
        href="https://github.com/watzon"
        target="_blank"
        rel="noopener noreferrer"
        class="text-teal-600 dark:text-teal-400 hover:underline">GitHub</a
      >
      <span class="bullet">•</span>
      <a
        href="https://watzon.tech"
        target="_blank"
        rel="noopener noreferrer"
        class="text-teal-600 dark:text-teal-400 hover:underline">Portfolio</a
      >
      •
      <a
        href="https://linkedin.com/in/watzon1993"
        target="_blank"
        rel="noopener noreferrer"
        class="text-teal-600 dark:text-teal-400 hover:underline">LinkedIn</a
      >
    </p>
  </section>

  <section class="mb-6">
    <h2>PROFESSIONAL SUMMARY</h2>
    <p class="text-lg">
      Full Stack Software Engineer with 10+ years of experience specializing in TypeScript and Go development. Expert in building scalable web applications, microservices, and developer tools. Proven track record of improving application performance by up to 600% and reducing deployment times by 70%. Strong focus on code quality, testing, and documentation. Open source contributor with multiple Go projects serving thousands of developers.
    </p>
  </section>

  <section class="mb-6">
    <h2>TECHNICAL SKILLS</h2>
    {#each Object.entries(technicalSkills) as [category, skills]}
      <div class="skills-section">
        <span class="skills-category font-bold">{category}:</span>
        <ul class="skills-list">
          {#each skills as skill}
            <li>{skill}</li>
          {/each}
        </ul>
      </div>
    {/each}
  </section>

  <section class="mb-6">
    <h2>PROFESSIONAL EXPERIENCE</h2>
    {#each experiences as job}
      <div class="mb-6 job-item">
        <h3 class="text-xl font-semibold">{job.title}</h3>
        <h4 class="!mt-0 !mb-1">{job.company} • {job.period}</h4>
        <p class="text-lg">{job.description}</p>
        <ul class="highlights-list">
          {#each job.highlights as highlight}
            <li>{highlight}</li>
          {/each}
        </ul>
      </div>
    {/each}
  </section>

  <section class="mb-6">
    <h2>NOTABLE PROJECTS</h2>
    {#each projects as project}
      <div class="mb-4 project-item">
        <h4 class="!mt-0 !mb-1">
          <a href={project.link} target="_blank" rel="noopener noreferrer" class="text-teal-600 dark:text-teal-400 hover:underline">
            {project.name}
          </a>
        </h4>
        <p class="!mt-0 !mb-1">{project.description}</p>
        <p class="project-technologies">Technologies: {project.technologies.join(" • ")}</p>
      </div>
    {/each}
  </section>

  <section>
    <h2>EDUCATION</h2>
    <div class="mb-4">
      <h4 class="!mt-0 !mb-1">{education.school}</h4>
      <p class="text-gray-500 dark:text-gray-300 !mt-0 !mb-1">{education.degree} • {education.period}</p>
      <p class="!mt-0">{education.description}</p>
    </div>
  </section>
</div>
