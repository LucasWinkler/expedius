<a id="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <!-- <a href="https://github.com/lucaswinkler/expedius">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a> -->

<h3 align="center">Expedius</h3>

  <p align="center">
    Find, organize, and share your favourite places from around the world.
    <br />
    <br />
    <a href="https://www.expedius.app/">View Live</a>
    &middot;
    <a href="https://github.com/lucaswinkler/expedius/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    &middot;
    <a href="https://github.com/lucaswinkler/expedius/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <!-- <li><a href="#acknowledgments">Acknowledgments</a></li> -->
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

[![Product Name Screen Shot][product-screenshot]](https://www.expedius.app/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

- [![Next][Next.js]][Next-url]
- [![React][React.js]][React-url]
- [![TailwindCSS][TailwindCSS]][TailwindCSS-url]
- [![Redis][Redis]][Redis-url]
- [![PostgreSQL][PostgreSQL]][PostgreSQL-url]
- [![Drizzle][Drizzle]][Drizzle-url]
- [![Vercel][Vercel]][Vercel-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm

- PostgreSQL database (or Neon.tech account for serverless PostgreSQL)
- Google Places API key
- Uploadthing account
- Upstash Redis account

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/lucaswinkler/expedius.git
   ```
2. Install packages
   ```sh
   pnpm install
   ```
3. Copy the `.env.example` file to `.env` and fill in the variables

4. Run the development server

   ```sh
   pnpm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->

## Roadmap

- [ ] Filtering, sorting, and searching for lists
- [ ] Possibly add social features
  - [ ] Followers
  - [ ] Following
  - [ ] Some type of social feed possibly?

<!-- See the [open issues](https://github.com/lucaswinkler/expedius/issues) for a full list of proposed features (and known issues). -->

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Top contributors:

<a href="https://github.com/lucaswinkler/expedius/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=lucaswinkler/expedius" alt="contrib.rocks image" />
</a>

<!-- LICENSE -->

## License

Distributed under the MIT license. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Lucas Winkler - [@LucasJWinkler](https://twitter.com/LucasJWinkler) - lucaswinkler@gmail.com

Project Link: [https://github.com/lucaswinkler/expedius](https://github.com/lucaswinkler/expedius)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->
<!--
## Acknowledgments

-  -->

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/lucaswinkler/expedius.svg?style=for-the-badge
[contributors-url]: https://github.com/lucaswinkler/expedius/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/lucaswinkler/expedius.svg?style=for-the-badge
[forks-url]: https://github.com/lucaswinkler/expedius/network/members
[stars-shield]: https://img.shields.io/github/stars/lucaswinkler/expedius.svg?style=for-the-badge
[stars-url]: https://github.com/lucaswinkler/expedius/stargazers
[issues-shield]: https://img.shields.io/github/issues/lucaswinkler/expedius.svg?style=for-the-badge
[issues-url]: https://github.com/lucaswinkler/expedius/issues
[license-shield]: https://img.shields.io/github/license/lucaswinkler/expedius.svg?style=for-the-badge
[license-url]: https://github.com/lucaswinkler/expedius/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/lucas-winkler
[product-screenshot]: images/screenshot.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[TailwindCSS]: https://img.shields.io/badge/Tailwind%20CSS-%2338B2AC.svg?logo=tailwind-css&logoColor=white
[TailwindCSS-url]: https://tailwindcss.com/
[Redis]: https://img.shields.io/badge/Redis-%23DD0031.svg?logo=redis&logoColor=white
[Redis-url]: https://upstash.com/
[PostgreSQL]: https://img.shields.io/badge/Postgres-%23316192.svg?logo=postgresql&logoColor=white
[PostgreSQL-url]: https://www.postgresql.org/
[Drizzle]: https://img.shields.io/badge/Drizzle-C5F74F?logo=drizzle&logoColor=000
[Drizzle-url]: https://orm.drizzle.team/
[Vercel]: https://img.shields.io/badge/Vercel-%23000000.svg?logo=vercel&logoColor=white
[Vercel-url]: https://vercel.com/
[TypeScript]: https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff
[TypeScript-url]: https://www.typescriptlang.org/
