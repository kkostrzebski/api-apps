import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './StarWarsManagementTool.css';

const StarWarsManagementTool = () => {
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [people, setPeople] = useState([]);
  const [starshipNames, setStarshipNames] = useState([]);
  const [selectedStarship, setSelectedStarship] = useState(null);
  const [totalPeople, setTotalPeople] = useState(0);
  const [databaseLoaded, setDatabaseLoaded] = useState(false);
  const [selectedPersonInfo, setSelectedPersonInfo] = useState({
    name: true,
    height: false,
    mass: false,
    birth_year: false,
    gender: false,
    eye_color: false,
    hair_color: false,
    skin_color: false,
  });
  const [selectedStarshipInfo, setSelectedStarshipInfo] = useState({
    name: true,
    model: false,
    manufacturer: false,
    cost_in_credits: false,
    length: false,
    max_atmosphering_speed: false,
    crew: false,
    passengers: false,
    cargo_capacity: false,
    consumables: false,
    hyperdrive_rating: false,
    MGLT: false,
    starship_class: false,
  });
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [vehicleNames, setVehicleNames] = useState([]);
  const [selectedVehicleInfo, setSelectedVehicleInfo] = useState({
    name: true,
    model: false,
    manufacturer: false,
    cost_in_credits: false,
    length: false,
    max_atmosphering_speed: false,
    crew: false,
    passengers: false,
    cargo_capacity: false,
    consumables: false,
    vehicle_class: false,
  });
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [planetInfo, setPlanetInfo] = useState({
    name: true,
    rotation_period: false,
    orbital_period: false,
    diameter: false,
    climate: false,
    gravity: false,
    terrain: false,
    population: false,
  });

  useEffect(() => {
    const fetchPeopleData = async () => {
      try {
        const response = await axios.get('https://swapi.dev/api/people/');
        const newPeopleData = response.data.results;
        const totalPeopleCount = response.data.count;

        const totalPages = Math.ceil(totalPeopleCount / 10);
        const remainingPages = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);

        if (remainingPages.length > 0) {
          const additionalResponses = await Promise.all(remainingPages.map(page => axios.get(`https://swapi.dev/api/people/?page=${page}`)));
          const additionalPeopleData = additionalResponses.map(response => response.data.results).flat();
          setPeople([...newPeopleData, ...additionalPeopleData]);
        } else {
          setPeople(newPeopleData);
        }

        setTotalPeople(totalPeopleCount);
        setDatabaseLoaded(true);
      } catch (error) {
        console.error('Error fetching people data:', error);
      }
    };

    fetchPeopleData();
  }, []);

  const handlePersonSelect = async event => {
    const selectedPersonUrl = event.target.value;
    const selectedPerson = people.find(person => person.url === selectedPersonUrl);
    setSelectedPerson(selectedPerson || null);

    if (selectedPerson) {
      const starshipNames = await getStarshipNamesForPerson(selectedPerson);
      setStarshipNames(starshipNames);
      setSelectedStarship(null); // Reset selected starship when selecting a new person.

      const vehicleNames = await getVehicleNamesForPerson(selectedPerson);
      setVehicleNames(vehicleNames);
      setSelectedVehicle(null); // Reset selected vehicle when selecting a new person.

      const planetInfo = await getPlanetInfoForPerson(selectedPerson);
      setSelectedPlanet(planetInfo);
    }
  };

  const handleStarshipClick = async starshipName => {
    try {
      const response = await axios.get(`https://swapi.dev/api/starships/?search=${starshipName}`);
      const starshipDetails = response.data.results[0];
      setSelectedStarship(starshipDetails);
    } catch (error) {
      console.error('Error fetching starship details:', error);
      setSelectedStarship(null);
    }
  };

  const handleVehicleClick = async vehicleName => {
    try {
      const response = await axios.get(`https://swapi.dev/api/vehicles/?search=${vehicleName}`);
      const vehicleDetails = response.data.results[0];
      setSelectedVehicle(vehicleDetails);
    } catch (error) {
      console.error('Error fetching vehicle details:', error);
      setSelectedVehicle(null);
    }
  };

  const getStarshipNamesForPerson = async person => {
    try {
      const starshipNames = await Promise.all(person.starships.map(async starshipUrl => {
        const response = await axios.get(starshipUrl);
        return response.data.name;
      }));
      return starshipNames;
    } catch (error) {
      console.error('Error fetching starship data:', error);
      return [];
    }
  };

  const getVehicleNamesForPerson = async person => {
    try {
      const vehicleNames = await Promise.all(person.vehicles.map(async vehicleUrl => {
        const response = await axios.get(vehicleUrl);
        return response.data.name;
      }));
      return vehicleNames;
    } catch (error) {
      console.error('Error fetching vehicle data:', error);
      return [];
    }
  };

  const getPlanetInfoForPerson = async person => {
    try {
      const response = await axios.get(person.homeworld);
      return response.data;
    } catch (error) {
      console.error('Error fetching planet data:', error);
      return null;
    }
  };

  const handlePersonInfoChange = event => {
    const { name, checked } = event.target;
    setSelectedPersonInfo(prevState => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const handleStarshipInfoChange = event => {
    const { name, checked } = event.target;
    setSelectedStarshipInfo(prevState => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const handleVehicleInfoChange = event => {
    const { name, checked } = event.target;
    setSelectedVehicleInfo(prevState => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const handlePlanetInfoChange = event => {
    const { name, checked } = event.target;
    setPlanetInfo(prevState => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const getCheckboxItems = (info, onChangeHandler) => {
    return Object.entries(info).map(([key, checked]) => (
      <div key={key}>
        <input type='checkbox' name={key} checked={checked} onChange={onChangeHandler} />
        <label htmlFor={key}>{key.replace(/_/g, ' ')}</label>
      </div>
    ));
  };

  const getInfoItems = (info, showInfo) => {
    return Object.entries(info).map(([key, value]) => showInfo[key] && <p key={key}>{`${key}: ${value}`}</p>);
  };

  return (
    <div className='StarWarsManagementTool'>
      <h1>Star Wars Management Tool</h1>

      {databaseLoaded ? (
        <p>Database loaded. Total people in database: {totalPeople}</p>
      ) : (
        <p>Loading database...</p>
      )}

      <div className='info-container'>
        <div className='person-section'>
          <div>
            <h2>People:</h2>
            <select onChange={handlePersonSelect}>
              <option value=''>Select a person</option>
              {people.map(person => (
                <option key={person.url} value={person.url}>
                  {person.name}
                </option>
              ))}
            </select>
          </div>

          <div className='checkbox-section'>{getCheckboxItems(selectedPersonInfo, handlePersonInfoChange)}</div>

          {selectedPerson && (
            <div className='selected-person'>
              <h2>Selected Person: {selectedPerson.name}</h2>
              {getInfoItems(selectedPerson, selectedPersonInfo)}
            </div>
          )}
        </div>

        <div className='starship-section'>
          <div>
            <h2>Starships:</h2>
            <ul className='starships-list'>
              {starshipNames.map(starshipName => (
                <li key={starshipName} onClick={() => handleStarshipClick(starshipName)}>
                  {starshipName}
                </li>
              ))}
            </ul>
          </div>

          <div className='checkbox-section'>{getCheckboxItems(selectedStarshipInfo, handleStarshipInfoChange)}</div>

          {selectedStarship && (
            <div className='selected-starship'>
              <h2>Selected Starship: {selectedStarship.name}</h2>
              {getInfoItems(selectedStarship, selectedStarshipInfo)}
            </div>
          )}
        </div>

        <div className='vehicle-section'>
          <div>
            <h2>Vehicles:</h2>
            <ul className='vehicles-list'>
              {vehicleNames.map(vehicleName => (
                <li key={vehicleName} onClick={() => handleVehicleClick(vehicleName)}>
                  {vehicleName}
                </li>
              ))}
            </ul>
          </div>

          <div className='checkbox-section'>{getCheckboxItems(selectedVehicleInfo, handleVehicleInfoChange)}</div>

          {selectedVehicle && (
            <div className='selected-vehicle'>
              <h2>{selectedVehicle.name}</h2>
              {getInfoItems(selectedVehicle, selectedVehicleInfo)}
            </div>
          )}
        </div>

        <div className='planet-section'>
          <div>
            <h2>Planet:</h2>
            {selectedPerson && selectedPlanet ? (
              <div>
                <h3>{selectedPlanet.name}</h3>
                <ul className='planet-info-list'>{getCheckboxItems(planetInfo, handlePlanetInfoChange)}</ul>
              </div>
            ) : (
              <p>No planet information available for the selected person.</p>
            )}
          </div>
          {selectedPerson && selectedPlanet && (
            <div className='selected-planet'>
              <h2>Informacje o planecie: {selectedPlanet.name}</h2>
              {getInfoItems(selectedPlanet, planetInfo)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StarWarsManagementTool;
