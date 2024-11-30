import { useEffect, useState } from "react";

const CountryCards = ({ name, flagImg, flagAlt }) => {
  return (
    <div
      className="countryCard"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        padding: "10px",
        margin: "10px",
        border: "1px solid grey",
        borderRadius: "8px",
        width: "200px",
        height: "200px",
      }}
    >
      <img src={flagImg} alt={flagAlt} style={{ height: "100px", width: "100px" }} />
      <h2>{name}</h2>
    </div>
  );
};

export default function Countries() {
  const API = "https://xcountries-backend.azurewebsites.net/all";
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch(API);
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await res.json();
        setCountries(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching countries:", error);
        setError(error.toString());
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredCountries = countries.filter((country) =>
    // country.name.common.toLowerCase().includes(searchTerm)
    country.name.toLowerCase().includes(searchTerm)
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (countries.length === 0) {
    return <div>No countries available</div>;
  }

  return (
    <div>
      <div className="search-container">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search for Countries ..."
          className="search-bar"
          style={{
            padding: "10px",
            fontSize: "14px",
            width: "50%",
            margin: "10px"
          }}
        />
      </div>
      {filteredCountries.length === 0 && searchTerm && (
        <p style={{ margin: "10px" }}>No matching countries found.</p>
      )}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        {filteredCountries.map((country) => (
          <CountryCards
            key={country.cca3}
            name={country.name}
            flagImg={country.flag}
            flagAlt={country.alt || `Flag of ${country.name}`}
          />
        ))}
      </div>
    </div>
  );
}
