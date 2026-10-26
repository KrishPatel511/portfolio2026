import { ProjectCaseStudy, CASE_STUDIES } from './ProjectCaseStudy';

/* Picks one project's data by page key, so App does not have to import all the case-study text. */
export default function CaseStudyRoute({ page }) {
  return <ProjectCaseStudy data={CASE_STUDIES[page]} />;
}
