const Header = (props) => <h2>{props.course}</h2>

const Content = (props) => {
  console.log("content", props)
  return (
    <>
      {props.parts.map(part => <Part key={part.name} part={part} />)}
    </>
  )
}

const Part = (props) => (
  <p>
    {props.part.name} {props.part.exercises}
  </p>
)

const Total = (props) => {
  const exercises = props.parts.map(value => value.exercises)
  console.log("exercises", exercises)
  const sum = exercises.reduce((a, b) => a + b, 0)
  return (
    <b>Total Number of exercises: {sum}</b>
  )
}

const Course = ({ course }) => {
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}
export default Course