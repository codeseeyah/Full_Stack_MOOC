import Part from './Part.jsx'

const Content = (props) => {
    console.log("content", props)
    return (
        <>
            {props.parts.map(part => <Part key={part.name} part={part} />)}
        </>
    )
}

export default Content