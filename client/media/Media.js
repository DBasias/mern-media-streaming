import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardHeader,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  IconButton,
  Avatar,
  Divider,
} from "@material-ui/core";
import { Edit } from "@material-ui/icons";
import { Link } from "react-router-dom";
import MediaPlayer from "./MediaPlayer";
import DeleteMedia from "./DeleteMedia";

const useStyles = makeStyles(theme => ({
  card: {
    padding: "20px",
  },
  header: {
    padding: "0px 16px 16px 12px",
  },
  action: {
    margin: "24px 20px 0px 0px",
    display: "inline-block",
    fontSize: "1.15em",
    color: theme.palette.secondary.dark,
  },
  avatar: {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.light,
  },
}));

export default function Media(props) {
  const classes = useStyles();

  const mediaUrl = props.media._id
    ? `/api/media/video/${props.media._id}`
    : null;
  const nextUrl = props.nextUrl;

  return (
    <Card className={classes.card}>
      <CardHeader
        className={classes.header}
        title={props.media.title}
        action={
          <span className={classes.action}>{props.media.views + " views"}</span>
        }
        subheader={props.media.genre}
      />
      <MediaPlayer
        srcUrl={mediaUrl}
        nextUrl={nextUrl}
        handleAutoplay={props.handleAutoplay}
      />
      <List dense>
        <ListItem>
          <ListItemAvatar>
            <Avatar className={classes.avatar}>
              {props.media.postedBy.name && props.media.postedBy.name[0]}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={props.media.postedBy.name}
            secondary={
              "Published on " + new Date(props.media.created).toDateString()
            }
          />
          {auth.isAuthenticated().user &&
            auth.isAuthenticated().user._id == props.media.postedBy._id && (
              <ListItemSecondaryAction>
                <Link to={"/media/edit/" + props.media._id}>
                  <IconButton aria-label="Edit" color="secondary">
                    <Edit />
                  </IconButton>
                </Link>
                <DeleteMedia
                  mediaId={props.media._id}
                  mediaTitle={props.media.title}
                />
              </ListItemSecondaryAction>
            )}
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText primary={props.media.description} />
        </ListItem>
      </List>
    </Card>
  );
}

Media.propTypes = {
  media: PropTypes.object,
  nextUrl: PropTypes.string,
  handleAutoplay: PropTypes.func.isRequired,
};
