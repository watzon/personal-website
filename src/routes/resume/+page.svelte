<script>
  const experiences = $state([
    {
      title: "Senior Software Engineer",
      company: "Ama Multimedia LLC",
      period: "2022-12 - 2024-03 • Remote",
      description: "Led frontend architecture and development initiatives for multiple streaming and content hosting platforms.",
      highlights: [
        "Spearheaded the creation of a unified Vue UI library, enhancing consistency across multiple product lines",
        "Split a monolithic streaming application into separate user-facing and backend components",
        "Refactored JavaScript portion of a Ruby on Rails application, reducing build times by 50%"
      ]
    },
    {
      title: "Senior Software Engineer",
      company: "Impartner Software",
      period: "2022-02 - 2022-11 • Lehi, UT",
      description: "Enhanced and maintained partner relationship management (PRM) solutions focusing on scalability and performance.",
      highlights: [
        "Improved core platform scalability and performance",
        "Implemented new features to streamline partner onboarding processes",
        "Optimized data synchronization between PRM and client CRM systems"
      ]
    },
    {
      title: "Senior Software Engineer",
      company: "Purple",
      period: "2021-11 - 2022-02 • Lehi, UT",
      description: "Optimized e-commerce platform performance and user experience through innovative solutions.",
      highlights: [
        "Developed 'tag router' AWS Lambda function to offload advertising tags from client",
        "Reduced page load times by 400% through server-side optimization",
        "Enhanced client-side performance and user experience on Purple's e-commerce platform"
      ]
    },
    {
      title: "Principle Software Engineer",
      company: "TruVision Health",
      period: "2020-08 - 2021-10 • Draper, UT",
      description: "Led technical initiatives and mentored development team while driving significant performance improvements.",
      highlights: [
        "Led optimization effort resulting in 600% increase in main site speed",
        "Mentored junior developers and improved team coding practices",
        "Implemented automated testing and deployment pipelines"
      ]
    },
    {
      title: "Senior Software Engineer",
      company: "NeuraLegion",
      period: "2018-08 - 2019-11 • Remote",
      description: "Contributed to AI-powered security testing solutions with focus on automation and vulnerability detection.",
      highlights: [
        "Developed browser automation engine speeding up attack surface scanning by 50%",
        "Implemented features for detecting complex web application vulnerabilities",
        "Collaborated with research team to incorporate security threat intelligence"
      ]
    },
    {
      title: "Software Engineer",
      company: "Pando Development",
      period: "2016-10 - 2019-02 • Remote",
      description: "Built robust file sharing and collaboration tools while delivering client solutions.",
      highlights: [
        "Developed core file sharing and collaboration platform features",
        "Built Ruby on Rails based portal for local mortuary client",
        "Implemented real-time collaboration features using WebSocket"
      ]
    },
    {
      title: "Associate Consultant",
      company: "Cloud Software LLC",
      period: "2016-02 - 2016-10 • Tempe, AZ",
      description: "Provided technical expertise for client portal modernization and cloud migration projects.",
      highlights: [
        "Transitioned legacy client portal to Angular 2",
        "Assisted in migration of systems to modern cloud platforms",
        "Developed custom integrations between cloud services"
      ]
    },
    {
      title: "QA Engineer",
      company: "NUVI",
      period: "2015-02 - 2015-08 • Lindon, UT",
      description: "Ensured quality and reliability of social media analytics tools through comprehensive testing.",
      highlights: [
        "Developed and executed comprehensive test plans",
        "Automated repetitive testing processes",
        "Collaborated with developers to resolve identified issues"
      ]
    },
    {
      title: "Web Developer",
      company: "Utah Valley University",
      period: "2014-08 - 2015-02 • Orem, UT",
      description: "Maintained and improved university web presence while implementing modern design principles.",
      highlights: [
        "Updated departmental websites with responsive design",
        "Enhanced mobile accessibility across university web properties",
        "Collaborated with content owners for timely information updates"
      ]
    },
  ]);

  const skills = $state([
    // Frontend
    "TypeScript",
    "Vue.js",
    "React",
    "Svelte",
    "Tailwind CSS",
    
    // Backend
    "Ruby on Rails",
    "Node.js",
    "Go",
    "Python",
    
    // Infrastructure & DevOps
    "AWS",
    "Docker",
    
    // Core Competencies
    "System Design",
    "API Development",
    "CI/CD",
    "Performance Optimization"
  ]);
</script>

<svelte:head>
  <meta property="og:type" content="article">
  <meta property="og:url" content="https://watzon.tech/resume">
  <meta property="og:title" content="Chris Watson - Resume">
  <meta property="og:description" content="View Chris Watson's resume, highlighting his experience as a Senior Software Engineer in Salt Lake City, UT">
  <meta property="og:image" content="https://watzon.tech/images/og-image.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Chris Watson - Senior Software Engineer - Salt Lake City, UT">
  <meta property="og:site_name" content="watzon.tech">
  <style>
    @page {
      margin: 0.5in;
      size: auto;
      marks: none;
    }
    @media print {
      html {
        height: 100%;
      }
      body {
        height: 100%;
      }
    }
  </style>
</svelte:head>

<style>
  @media print {
    /* Hide navigation and other layout elements */
    :global(header),
    :global(footer),
    :global(.dark-mode-toggle) {
      display: none !important;
    }

    /* Reset background colors and text colors for printing */
    :global(body),
    :global(.dark),
    :global(.dark .dark\:bg-gray-900),
    :global(.bg-orange-50) {
      background: white !important;
      color: black !important;
    }

    /* Optimize layout for printing */
    :global(.prose) {
      max-width: none !important;
      padding: 0 !important;
      margin: 0 !important;
    }

    /* Adjust text sizes for print */
    h2 {
      font-size: 24px !important;
      margin-bottom: 4px !important;
    }

    h3 {
      font-size: 20px !important;
      margin-bottom: 4px !important;
    }

    h4 {
      font-size: 16px !important;
      margin-bottom: 4px !important;
    }

    p {
      font-size: 14px !important;
      line-height: 1.4 !important;
      margin-bottom: 8px !important;
    }

    /* Improve skill tags layout */
    .skills-container {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      justify-content: flex-start !important;
      margin: 12px 0;
    }

    .skill-tag {
      background: none !important;
      border: none !important;
      color: #333 !important;
      padding: 2px 8px !important;
      margin: 0 !important;
      font-size: 12px !important;
      position: relative;
    }

    .skill-tag:not(:last-child)::after {
      content: "•";
      position: absolute;
      right: -4px;
      color: #666;
    }

    /* Handle page breaks */
    section {
      page-break-inside: auto;
    }

    .job-item {
      page-break-inside: avoid;
      margin-bottom: 16px !important;
    }

    /* Format links for print */
    a {
      color: #333 !important;
      text-decoration: none !important;
    }

    a[href^="http"]::after {
      content: " (" attr(href) ")";
      font-size: 12px;
      color: #666;
    }

    /* Hide decorative elements */
    :global(.dark\:prose-invert) {
      filter: none !important;
    }

    /* Style bullet points for print */
    .highlights-list {
      margin: 8px 0 0 0 !important;
      padding-left: 20px !important;
    }

    .highlights-list li {
      font-size: 13px !important;
      line-height: 1.4 !important;
      margin-bottom: 2px !important;
      page-break-inside: avoid;
    }
  }
</style>

<div class="prose prose-xl max-w-full dark:prose-invert">
  <section>
    <h2 class="!mt-0 !mb-2">Christopher Watson</h2>
    <h4 class="!mt-0 !mb-2">
      Senior Software Engineer • Salt Lake City, UT
    </h4>
    <p class="!text-sm !mb-12">
      <a href="mailto:chris@watzon.tech" class="text-teal-600 dark:text-teal-400 hover:underline"
        >chris@watzon.tech</a
      >
      •
      <a
        href="https://linkedin.com/in/watzon1993"
        target="_blank"
        rel="noopener noreferrer"
        class="text-teal-600 dark:text-teal-400 hover:underline">LinkedIn</a
      >
      •
      <a
        href="https://github.com/watzon"
        target="_blank"
        rel="noopener noreferrer"
        class="text-teal-600 dark:text-teal-400 hover:underline">GitHub</a
      >
    </p>
  </section>

  <section class="mb-12">
    <p class="text-lg">
      In the ever-evolving landscape of software engineering, I've spent over a decade crafting digital solutions that push the boundaries of what's possible. My journey has been guided by the wisdom of Linus Torvalds, who said, "Talk is cheap. Show me the code." And that's exactly what I've done.
    </p>
    <p class="text-lg">
      From optimizing site speeds by 600% to architecting scalable web applications, I've consistently turned complex challenges into elegant solutions. My expertise lies in full-stack development, with a particular passion for harnessing the power of modern JavaScript technologies. I don't just write code; I build digital experiences that make a difference.
    </p>
  </section>

  <section>
    <div class="flex flex-wrap gap-2 justify-center skills-container">
      {#each skills as skill}
        <span class="bg-stone-300 dark:bg-gray-700 text-teal-700 dark:text-teal-400 px-2 py-1 rounded text-lg skill-tag"
          >{skill}</span
        >
      {/each}
    </div>
  </section>

  <section>
    <h3>Experience</h3>
    {#each experiences as job}
      <div class="mb-6 job-item">
        <h3 class="text-xl font-semibold">{job.title} - {job.company}</h3>
        <p class="text-lg text-gray-500 dark:text-gray-300 mb-2">{job.period}</p>
        <p class="text-lg">{job.description}</p>
        <ul class="highlights-list">
          {#each job.highlights as highlight}
            <li>{highlight}</li>
          {/each}
        </ul>
      </div>
    {/each}
  </section>
</div>
