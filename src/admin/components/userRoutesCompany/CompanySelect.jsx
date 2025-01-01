import React, { useEffect, useState } from "react";
import "../Users.css";
import apiClient from "../../../api/apiClient";
import { FaLongArrowAltRight } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { IoMdAddCircleOutline } from "react-icons/io";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setLoading } from "../../../redux/slices/UniversalLoader";
import { useNavigate } from "react-router-dom";

const CompanySelect = () => {
  const [companiesList, setCompaniesList] = useState([]);
  const [filteredCompaniesList, setCompaniesFilteredList] = useState([]);
  const [query, setQuery] = useState("");
  const [createCompany, setCreateCompany] = useState({
    name: "",
    email: "",
    phonenumber: "",
    address: "",
  });
  const [existingCompanyPopUp, setExistingCompanyPopUp] = useState(false);
  const [createCompanyPopUp, setCreateCompanyPopUp] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    dispatch(setLoading(true));
    try {
      const res = await apiClient.get("/auth/companies");
      setCompaniesList(res?.data);
      setCompaniesFilteredList(res?.data);
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      toast.error("Something went wrong!");
    }
  };

  const handleSearch = (e) => {
    setQuery(e.target.value);
    if (e.target.value.length > 0) {
      const filteredCompanies = companiesList?.filter((item) =>
        item.name.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setCompaniesFilteredList(filteredCompanies);
    } else {
      setCompaniesFilteredList(companiesList);
    }
  };

  const handleCreateCompanyChange = (e) => {
    setCreateCompany({ ...createCompany, [e.target.name]: e.target.value });
  };

  const handleCreateCompany = async () => {
    dispatch(setLoading(true));
    try {
      const res = await apiClient.post("/auth/companies", createCompany);
      toast.success("Company created successfully!");
      setCreateCompany({
        name: "",
        email: "",
        phonenumber: "",
        address: "",
      });
      navigate(`/dashboard/users/supervisoremployee/${res?.data?.data?._id}`);
      dispatch(setLoading(false));
      await fetchCompanies();
      setCreateCompanyPopUp(false);
      setExistingCompanyPopUp(true);
    } catch (error) {
      dispatch(setLoading(false));
      toast.error(error?.response?.data?.error);
    }
  };

  const handleCompanyLink = (id) => {
    navigate(`/dashboard/users/supervisoremployee/${id}`);
  };

  return (
    <>
      <div className="admin_users_container_first">
        <h2>Select/Create Company</h2>
        <button onClick={() => setExistingCompanyPopUp(true)}>
          Select a existing company <FaLongArrowAltRight size={"20"} />
        </button>
        <button onClick={() => setCreateCompanyPopUp(true)}>
          Create new Company <FaLongArrowAltRight size={"20"} />
        </button>
      </div>
      {existingCompanyPopUp && (
        <div className="admin_users_container_first_existing_company_container">
          <div className="admin_users_container_first_existing_company_container_second">
            <div className="admin_users_container_first_existing_user">
              <h3>Select a Company</h3>
              <h3>
                <IoClose onClick={() => setExistingCompanyPopUp(false)} />
              </h3>
            </div>
            <div className="admin_search_exist_company_search">
              <input
                placeholder="Search..."
                type="text"
                value={query}
                onChange={handleSearch}
                className="admin_search_exist_company_input"
              />
              <button
                type="submit"
                className="admin_search_exist_company_button"
              >
                Search
              </button>
            </div>
            <div>
              {filteredCompaniesList?.map((item) => {
                return (
                  <p
                    key={item?._id}
                    onClick={() => handleCompanyLink(item._id)}
                  >
                    {item?.name}
                  </p>
                );
              })}
            </div>
          </div>
        </div>
      )}
      {createCompanyPopUp && (
        <div
          data-aos="fade-out"
          data-aos-duration="300"
          data-aos-once="true"
          className="admin_users_container_first_create_company_container"
        >
          <section>
            <div>
              <h3>Create new Company</h3>
              <h3>
                <IoClose onClick={() => setCreateCompanyPopUp(false)} />
              </h3>
            </div>
            <div className="admin_create_new_company_input_container">
              <input
                type="text"
                name="name"
                value={createCompany.name}
                onChange={handleCreateCompanyChange}
                placeholder="Enter company name..."
              />
              <input
                type="email"
                name="email"
                value={createCompany.email}
                onChange={handleCreateCompanyChange}
                placeholder="Enter company email..."
              />
              <input
                type="number"
                name="phonenumber"
                value={createCompany.phonenumber}
                onChange={handleCreateCompanyChange}
                placeholder="Enter company phone no..."
              />
              <textarea
                name="address"
                value={createCompany.address}
                onChange={handleCreateCompanyChange}
                placeholder="Enter company address..."
                rows={5}
              />
              <button onClick={handleCreateCompany}>
                Create <IoMdAddCircleOutline />
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default CompanySelect;
