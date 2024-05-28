import AddEventForm from "../components/AddEventForm";
import EventsTable from "../components/EventsTable";

const Home = () => {
  return (
    <div className="wrapper">
      <AddEventForm />
      <EventsTable />
    </div>
  );
};

export default Home;
