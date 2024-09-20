import AddEventForm from "../components/AddEventForm";
import EventsTable from "../components/EventsTable";

const Home = () => {
  return (
    <div className="wrapper">
      <h1 className="page-logo">Event Manager Pro</h1>
      <AddEventForm />
      <EventsTable />
    </div>
  );
};

export default Home;
