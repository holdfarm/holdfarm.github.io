/* eslint-disable react-hooks/exhaustive-deps */
import Button from "@material-ui/core/Button";
import { useWeb3React } from "@web3-react/core";
import { formatAddress } from "../../utils";
import { Grid, IconButton } from "@material-ui/core";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { Typography } from "@material-ui/core";
import styled from "styled-components";
import { injected } from "../../hooks/connectors";
import { useEffect, useState } from "react";
import { useEagerConnect, useInactiveListener } from "../../hooks";
function HeaderBar() {
  const { deactivate, active, account, activate, connector } = useWeb3React();

  const connectorsByName = {
    Injected: injected,
  };

  const [activatingConnector, setActivatingConnector] = useState(true);

  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(false);
    } else {
      setTimeout(() => {
        if (!active) {
          setActivatingConnector(false);
        }
      }, 600);
    }
  }, [activatingConnector, active, connector, setActivatingConnector]);

  const triedEager = useEagerConnect();

  useInactiveListener(!triedEager || !!activatingConnector);

  const activateWallet = async (currentConnector, name) => {
    setActivatingConnector(currentConnector);
    await activate(connectorsByName[name]);
    window.localStorage.setItem("wallet", name);
  };

  return (
    <StyledHeader>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <div>
          <Typography variant="h6">
            <b>HOLD.FARM</b>
          </Typography>
        </div>
        <div className="header-right">
          <Button
            variant="contained"
            className="buy-button"
            color="secondary"
            href="https://exchange.pancakeswap.finance/#/swap?outputCurrency=0x593bdbaf7e65c51f5a35761cc688245a560e6a02"
            target="_blank"
          >
            Buy HOLD
          </Button>
          {active && (
            <>
              <Button color="primary" variant="outlined">
                {account && formatAddress(account)}
              </Button>
              <IconButton
                color="secondary"
                onClick={() => {
                  localStorage.removeItem("wallet");
                  deactivate();
                }}
              >
                <ExitToAppIcon />
              </IconButton>
            </>
          )}

          {!active && (
            <>
              {connectorsByName &&
                Object.keys(connectorsByName).map((name) => {
                  const currentConnector = connectorsByName[name];
                  return (
                    <div key={name}>
                      {currentConnector && name === "Injected" && (
                        <Button
                          variant="contained"
                          color="primary"
                          key={name}
                          onClick={() => {
                            activateWallet(currentConnector, name);
                          }}
                        >
                          Connect Your Wallet
                        </Button>
                      )}
                    </div>
                  );
                })}
            </>
          )}
        </div>
      </Grid>
    </StyledHeader>
  );
}

const StyledHeader = styled.div`
  padding: 20px 0;
  height: 80px;

  .buy-button {
    margin-right: 16px;
    width: 200px;
    color: #fff;
    font-weight: 700;
  }

  .header-right {
    display: flex;
    flex-direction: row;
  }
`;

export default HeaderBar;
