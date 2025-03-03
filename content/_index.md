---
# Leave the homepage title empty to use the site title
title: ""
date: 2022-10-24
type: landing

design:
  # Default section spacing
  spacing: "6rem"

sections:
  - block: resume-biography-3
    content:
      # Choose a user profile to display (a folder name within `content/authors/`)
      username: admin
      text: ""
      # Show a call-to-action button under your biography? (optional)
      button:
        text: Download CV
        url: uploads/resume.pdf
    design:
      css_class: dark
      background:
        color: "#9c92ac"
        image:
          # Add your image background to `assets/media/`.
          filename: pattern.svg
          filters:
            brightness: 1.0
          size: cover
          position: center
          parallax: false
  - block: markdown
    content:
      title: "🧑🏽‍💻 My Work"
      subtitle: ""
      text: |-
        I'm a data scientist and researcher. My toolkit combines data science, program evaluation, and economics to analyze societal outcomes in the higher education, workforce, and science policy fields.

        At Mathematica, I routinely work with clients such as the National Science Foundation, to better understand and leverage their data for rigorous decision making. I combine rigorous causal inference methodologies and advanced machine learning techniques with qualitative work to extract meaningful patterns from administrative data and unstructured text.

        Don't hesitate to reach out! 🤗
    design:
      columns: "1"
  - block: collection
    content:
      title: Selected Publications
      text: ""
      filters:
        folders:
          - publication
        exclude_featured: false
    design:
      view: citation
---
