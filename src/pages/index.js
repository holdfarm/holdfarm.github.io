import { Container } from "@material-ui/core";
import React from "react";
import { Route, Switch } from "react-router-dom";
import FooterBar from "./../components/FooterBar/index";
import HeaderBar from "./../components/HeaderBar/index";
import Dashboard from "./dashboard/index";
import styled from "styled-components";

function MainPage() {
  return (
    <Container maxWidth="lg">
      <MainWrapper>
        <HeaderBar />
        <Switch>
          <Route exact path="/" component={() => <Dashboard />} />
        </Switch>
        <FooterBar />
      </MainWrapper>
    </Container>
  );
}

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100vh;
`;

export default MainPage;
