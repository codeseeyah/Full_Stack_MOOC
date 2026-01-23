const Total = (props) => {
    const exercises = props.parts.map(value => value.exercises)
    console.log("exercises", exercises)
    const sum = exercises.reduce((a, b) => a + b, 0)
    return (
        <p>Number of exercises {sum}</p>
    )
}

export default Total