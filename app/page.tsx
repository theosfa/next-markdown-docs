// import { getSortedPostsData } from '../lib/posts';
import utilStyles from '../styles/utils.module.css';

export default async function Home() {
  // const allPostsData = getSortedPostsData(); // works because it's server code

  return (
    <div className="justify-center items-center">
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Overview
      </h2>
      {/* <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              {title}
              <br />
              {id}
              <br />
              {date}
            </li>
          ))}
        </ul>
      </section> */}
    </div>
  );
}
