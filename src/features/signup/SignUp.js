//A sign in page. Taken mostly from material-ui examples https://github.com/mui-org/material-ui/tree/master/docs/src/pages/getting-started/templates/sign-in
import React from 'react';
import { useRef, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { ENDPOINT } from "./../requests";
import { Link as RouterLink, Redirect } from "react-router-dom"

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function SignUp({ loginCallbackFn }) {
    const classes = useStyles();

    const form = useRef(null)
    const [redirect, setRedirect] = useState(false)

    const onSubmit = (e) => {
        e.preventDefault();
        let fd = new FormData(form.current)
        fetch(`${ENDPOINT}/api/signup_user`, {
            method: "POST",
            body: fd
        }).then((response) => {
            console.log(response)
            if (response.status === 200) {
                setRedirect(true)
            }
        })
    }

    if (!redirect) {
        return (
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign Up
                    </Typography>
                    <form className={classes.form} ref={form} onSubmit={onSubmit} noValidate>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="current-username"
                            autoFocus
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="email"
                            label="Email"
                            type="email"
                            id="email"
                            autoComplete="email"
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Sign Up
                        </Button>
                        <Grid container>
                            <Grid item>
                                <Link component={RouterLink} to="/login" variant="body2">
                                    {"Have an Account? Sign In"}
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </Container>
        );
    } else {
        return <Redirect to="/login"/>
    }
}