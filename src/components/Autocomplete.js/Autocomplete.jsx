import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Autocomplete.css";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import { COUNTRIES_API } from "../../api/countries";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  searchInput: {
    borderBottom: "none",
    borderRadius: "5px",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    padding: theme.spacing(1),
    boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
    transition: "all 0.3s cubic-bezier(.25,.8,.25,1)",
    backgroundColor: "#42a6f5",
    "&:hover": {
      opacity: 0.9,
    },
  },
}));

const Autocomplete = () => {
  const classes = useStyles();
  const [activeIndex, setActiveIndex] = useState(0);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [userInput, setUserInput] = useState("");

  useEffect(() => {
    if (userInput[userInput.length - 1] !== "") fetchData();
  }, [userInput]);

  useEffect(() => {
    const el = document.querySelector(".sugg-" + activeIndex);
    el?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [activeIndex]);

  const fetchData = async () => {
    try {
      const { data } = await axios.post(COUNTRIES_API, {
        text: userInput,
      });
      setFilteredSuggestions(
        data.map((item) => {
          return { code: item.code, name: item.name };
        })
      );
    } catch (err) {
      throw new Error(err);
    }
  };

  const onChange = (event) => {
    setUserInput(event.currentTarget.value);
    setActiveIndex(0);
    setShowSuggestions(true);
  };

  const onClick = (event) => {
    setUserInput(event.currentTarget.innerText);
    setActiveIndex(0);
    setFilteredSuggestions([]);
    setShowSuggestions(false);
  };

  const onKeyDown = (event) => {
    if (event.keyCode === 13) {
      setUserInput(filteredSuggestions[activeIndex].name);
      setActiveIndex(0);
      setShowSuggestions(false);
    } else if (event.keyCode === 38) {
      // User pressed the up arrow, decrement index
      if (activeIndex === 0) return;
      setActiveIndex((prev) => prev - 1);
    } else if (event.keyCode === 40) {
      // User pressed the down arrow, increment index
      if (activeIndex - 1 === filteredSuggestions.length) return;
      setActiveIndex((prev) => prev + 1);
    }
  };

  const isDisplaySuggestions =
    showSuggestions && userInput !== "" && filteredSuggestions.length > 0;

  const Suggestions = () => {
    return (
      <ul className="suggestions">
        {filteredSuggestions.map((suggestion, index) => {
          return (
            <li
              className={clsx(
                "suggestion sugg-" + index,
                index === activeIndex && "suggestion-active"
              )}
              key={suggestion.code}
              onClick={onClick}
            >
              {suggestion.name}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="autocomplete">
      <TextField
        className={classes.searchInput}
        aria-label="Search content"
        type="search"
        fullWidth
        placeholder="Search..."
        onChange={onChange}
        onKeyDown={onKeyDown}
        value={userInput}
        InputProps={{
          disableUnderline: true,
          style: { fontFamily: "Arial", color: "white" },
          startAdornment: <SearchIcon />,
        }}
      />
      {isDisplaySuggestions && Suggestions()}
    </div>
  );
};

export default Autocomplete;
