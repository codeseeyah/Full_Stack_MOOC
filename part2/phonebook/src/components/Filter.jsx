const Filter = ({filterText, handleFilter}) => {
    return (
        <p>Filter shown with <input value={filterText} onChange={handleFilter} /></p>
    )
}

export default Filter