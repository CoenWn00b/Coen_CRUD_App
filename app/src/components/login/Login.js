import {LoginWrapper} from "./styled_Login";
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import config from "../../config";
import { UserContext } from "../../context/UserContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const apiUrl = config[process.env.REACT_APP_NODE_ENV || "development"].apiUrl;

//adapted from MUI "sign-up" template
function Login() {
    const [user, setUser] = useContext(UserContext);
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies(["name"]);
    const handleSubmit = (event) => {
        event.preventDefault();
        let username;
        let password;
        if (document.getElementById("username").value){
            username = document.getElementById("username").value;}
        if (document.getElementById("password").value){
            password = document.getElementById("password").value;}
        if (username && password){
            let options = {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({
                username: username,
                password: password,
                }),
            };
            fetch(`${apiUrl}login`, options)
                .then(res=>{
                    if(res.status === 200){
                        return(res.json())
                    }else if(res.status === 400){
                        return false;
                    }
                })
                .then(data => {
                    if(data){
                        let payloadString = atob(data.token.split(".")[1]).replaceAll("[", "").replaceAll("]", "");
                        let payloadData = JSON.parse(payloadString);
                        setCookie("crud_app_user", data.token);
                        setUser({
                            id: payloadData.id,
                            firstName: payloadData.first_name,
                            lastName: payloadData.last_name,
                        });
                        navigate('/');
                    }
                })
                .catch(err => console.error(err.status));
                
        };
        const data = new FormData(event.currentTarget);
        console.log({
            username: data.get('username'),
            password: data.get('password'),
        
        });
    }
    return (
        <LoginWrapper>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Login
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Log-In
              </Button>
              <Grid container justifyContent="flex-end">
              </Grid>
            </Box>
          </Box>
        </Container>
      </LoginWrapper>

    );
  }
  
  export default Login;