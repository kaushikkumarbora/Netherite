import '../landing.css';

const generateRows = (Asset, index) => {
    return (
        <tr>
            <td>{index}</td>
            <td>{Asset.asset_id}</td>
            <td>{Asset.hostname}</td>
            <td>{Asset.ip}</td>
            <td>{Asset.mac}</td>
            <td>{Asset.os}</td>
            <td>{Asset.build}</td>
            <td>{Asset.workgroup}</td>
            <td>{Asset.domain}</td>
            <td>{Asset.status}</td>
        </tr>)
}

const Search = ({ Assets }) => {

    return (
        <>
            {Assets.map(generateRows)}
        </>
    );
}

export default Search;