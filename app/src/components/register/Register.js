import {RegisterWrapper} from "./styled_Register";
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
function Register() {
    const [user, setUser] = useContext(UserContext);
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies(["name"]);
    const handleSubmit = (event) => {
        event.preventDefault();
        let username_reg;
        let password_reg;
        let firstName;
        let lastName;
        if (document.getElementById("username_reg").value){
            username_reg = document.getElementById("username_reg").value;}
        if (document.getElementById("password_reg").value){
            password_reg = document.getElementById("password_reg").value;}
        if (document.getElementById("firstName").value){
            firstName = document.getElementById("firstName").value;}        
        if (document.getElementById("lastName").value){
            lastName = document.getElementById("lastName").value;}

        if (username_reg && password_reg && firstName && lastName){
            let options = {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({
                username: username_reg,
                password: password_reg,
                firstName: firstName,
                lastName: lastName,
                }),
            };
            fetch(`${apiUrl}register`, options)
                .then(res=>{
                    if(res.status === 201){
                        return(res.json())
                    }else {
                        return false;
                    }
                })
                .then(data => {
                    options = {
                        method: "POST",
                        headers: {
                        "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                        username: username_reg,
                        password: password_reg,
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
        <RegisterWrapper>
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
              Register
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="given-name"
                    name="firstName"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="family-name"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="username_reg"
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
                    id="password_reg"
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
                Sign Up
              </Button>
              <Grid container justifyContent="flex-end">
              </Grid>
            </Box>
          </Box>
        </Container>
      </RegisterWrapper>

    );
  }
  
  export default Register;