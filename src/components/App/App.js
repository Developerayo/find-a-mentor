import './App.css';
import mentors from '../../mentors.json';

import React, { Component } from 'react';
import classNames from 'classnames';
import MentorsList from '../MentorsList/MentorsList';
import Filter from '../Filter/Filter';
import Logo from '../Logo';
import SocialLinks from '../SocialLinks/SocialLinks';
import shuffle from 'lodash/shuffle';
import { toggle, get } from '../../favoriteManager';

// const serverEndpoint = 'http://localhost:3001';
class App extends Component {
  state = {
    mentors: shuffle(mentors),
    favorites: get(),
  };

  handleTagSelect = async ({ value: tag }) => {
    await scrollToTop();
    this.setState({
      tag,
    });
  };

  handleCountrySelect = async ({ value: country }) => {
    await scrollToTop();
    this.setState({
      country,
    });
  };

  handleNameSelect = async ({ value: name }) => {
    await scrollToTop();
    this.setState({
      name,
    });
  };

  filterMentors = mentor => {
    const { tag, country, name, showFavorite, favorites } = this.state;
    return (
      (!tag || mentor.tags.includes(tag)) &&
      (!country || mentor.country === country) &&
      (!name || mentor.name === name) &&
      (!showFavorite || favorites.indexOf(mentor.id) > -1)
    );
  };

  toggleFields = () => {
    this.setState({
      fieldsIsActive: !this.state.fieldsIsActive,
    });
  };

  toggleSwitch = async showFavorite => {
    await scrollToTop();
    this.setState({
      showFavorite,
    });
  };

  onFavMentor = mentor => {
    const favorites = toggle(mentor);
    this.setState({
      favorites,
    });
  };

  componentDidMount() {
    if (window && window.ga) {
      const { location, ga } = window;
      ga('set', 'page', location.href);
      ga('send', 'pageview');
    }
  }

  render() {
    const { mentors, fieldsIsActive } = this.state;
    const mentorsInList = mentors.filter(this.filterMentors);

    return (
      <div className="app">
        <main>
          <aside className="sidebar">
            <a className="logo" href="/">
              <Logo width={110} height={50} color="#68d5b1" />
            </a>
            <Filter
              onTagSelected={this.handleTagSelect}
              onCountrySelected={this.handleCountrySelect}
              onNameSelected={this.handleNameSelect}
              onToggleFilter={this.toggleFields}
              onToggleSwitch={this.toggleSwitch}
              mentorCount={mentorsInList.length}
            />
            <SocialLinks />
            <a
              href="https://www.patreon.com/codingcoach_io"
              className="patreon-link"
              aria-label="Become a Patreon. A Patreon is a person who helps economically a project he or she believes in."
              rel="noopener noreferrer"
              target="_blank"
            >
              <img
                src={`${
                  process.env.PUBLIC_URL
                }/images/coding-coach-patron-button.jpg`}
                alt="Become a Patron"
              />
            </a>
          </aside>
          <MentorsList
            className={classNames({
              active: fieldsIsActive,
            })}
            mentors={mentorsInList}
            favorites={this.state.favorites}
            onFavMentor={this.onFavMentor}
          />
        </main>
        <footer>
          <a
            rel="noopener noreferrer"
            href="https://github.com/Coding-Coach/coding-coach/blob/develop/src/pages/static/TermsAndConditions.md#terms-and-conditions"
            target="_blank"
          >
            Terms & Conditions
          </a>
          <a
            rel="noopener noreferrer"
            href="https://github.com/Coding-Coach/coding-coach/blob/develop/src/pages/static/CookiesPolicy.md#what-are-cookies"
            target="_blank"
          >
            Cookies
          </a>
          <a
            rel="noopener noreferrer"
            href="https://github.com/Coding-Coach/coding-coach/blob/develop/src/pages/static/PrivacyPolicy.md#effective-date-october-03-2018"
            target="_blank"
          >
            Privacy Policy
          </a>
        </footer>
      </div>
    );
  }
}

export default App;

function scrollToTop() {
  const scrollDuration = 200;
  return new Promise(resolve => {
    var scrollStep = -window.scrollY / (scrollDuration / 15),
      scrollInterval = setInterval(function() {
        if (window.scrollY !== 0) {
          window.scrollBy(0, scrollStep);
        } else {
          clearInterval(scrollInterval);
          resolve();
        }
      }, 15);
  });
}
