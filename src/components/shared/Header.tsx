import { Helmet } from "react-helmet-async"
import { HeaderProps } from "../../types/PagePropTypes"

const APP_NAME = import.meta.env.VITE_APP_NAME
const PROJECT = import.meta.env.VITE_PROJECT
const defaultDescription = `This is ${APP_NAME}`

const Header = (props: HeaderProps) => {
	let title = props.title ?? APP_NAME
	let project = props.project ?? PROJECT
	
  return (
    <Helmet>
      <title>{`${title} | ${project}`}</title>
      <meta name="description" content={defaultDescription} />
      <meta property="og:title" content={title} />
      <meta
        property="og:description"
        content={defaultDescription}
      />
    </Helmet>
  )
}

export { Header, APP_NAME, PROJECT, defaultDescription }
