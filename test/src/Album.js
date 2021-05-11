import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CameraIcon from '@material-ui/icons/PhotoCamera';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles, fade } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';

import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';

import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

import './Album.css';

class Album extends React.Component {
  
  constructor(props) {
    super(props);

    //Define state
    this.state = {
                    cards : [], 
                    keywordReddit:this.props.category,
                    nResults: -1,
                    isLoading: true,
                    isOpen: false,
                    isOpenCard:{}
                  };

    //Search Event
    this.keyPress = this.keyPress.bind(this);
    
    //Load Photos
    this.getPhotosRedditFromApiAsync(this.props.category);
  }


  //Search Keyword
  keyPress(e){
      if(e.keyCode === 13){
          this.setState({ keywordReddit: e.target.value });
          //Load Photos
          this.getPhotosRedditFromApiAsync(e.target.value);
      }
   }
   //End Search Keyword

  //Get Photos from API reddit.com
  getPhotosRedditFromApiAsync(KeywordSearch) {
     this.setState({ isLoading: true });
     return  fetch('https://www.reddit.com/r/' + KeywordSearch + '/top.json?limit=9')
     .then((response) => response.json())
     .then((responseJson) => {
        //console.log(responseJson.data.children);
        var arrPhotos = [];

        responseJson.data.children.forEach(function(item, index){

                                                                  var imageLarge = item.data.thumbnail;
                                                                  try{
                                                                    if (item.data.preview.images[0].source.url){
                                                                      imageLarge=item.data.preview.images[0].source.url.replace(/amp;/g, "");;
                                                                    }
                                                                  }catch(ex){}
                                                                  arrPhotos.push({
                                                                            id: index,
                                                                            header: item.data.title,
                                                                            image: item.data.thumbnail,
                                                                            imageLarge: imageLarge,
                                                                            author: item.data.author
                                                                          });
                                                                 //console.log(item.data.thumbnail)
                                                                 }
                                         );

        //console.log(arrPhotos);

        this.setState({ nResults: arrPhotos.length });
        this.setState({ isLoading: false });

        this.setState({
          cards: arrPhotos
        });

       return;
     })

     .catch((error) => {
       this.setState({ nResults: 0 });
       this.setState({ isLoading: false });
       console.error(error);
     });
  }
 //End Get Photos from API reddit.com
  

  //Function Open Dialog Full Screen
  handleClickOpen = card => {
    this.setState({ isOpenCard: card });
    this.setState({ isOpen: true });
  };
  //End Function Open Dialog Full Screen


  //Function Close Dialog Full Screen
  handleClose = () => {
     this.setState({ isOpen: false });
  };
  //End Function Close Dialog Full Screen
  

  //render Album
  render() {
        return (
          <React.Fragment>
            <CssBaseline />
            
            {/* TOOLBAR ALBUM */}
            <AppBar position="static">
              <Toolbar>
                <CameraIcon className={this.props.classes.icon} />
                <Typography className={this.props.classes.title} variant="h6" color="inherit" noWrap>
                  Photo gallery from Reddit.com
                </Typography>
                <div className={this.props.classes.search}>
                  <div className={this.props.classes.searchIcon}>
                    <SearchIcon />
                  </div>
                  <InputBase
                    placeholder="Search Keyword…"
                    classes={{
                      root: this.props.classes.inputRoot,
                      input: this.props.classes.inputInput,
                    }}
                    inputProps={{ 'aria-label': 'search' }}
                    onKeyDown={this.keyPress} 
                    
                  />
                </div>
              </Toolbar>
            </AppBar>
             {/* END TOOLBAR ALBUM */}
            
            <main>
            
              {/* HEADER KEYWORD REDDIT */}
              <div className={this.props.classes.heroContent}>
                <Container maxWidth="sm">
                  <Typography component="h1" variant="h4" align="center" color="textPrimary" gutterBottom>
                    Photo gallery from Reddit.com: {this.state.keywordReddit} 
                  </Typography>
                  {this.state.nResults >= 0 && ( 
                    <Typography variant="h5" align="center" color="textSecondary" paragraph>
                      Find {this.state.nResults} elements
                    </Typography>
                  )}
                  <Typography variant="h5" align="center" color="textSecondary" paragraph>
                    To search for Reddit keywords, use the search function
                  </Typography>
                </Container>
              </div>
              {/* END HEADER KEYWORD REDDIT */}
              

              <Container className={this.props.classes.cardGrid} maxWidth="md">
                {this.state.isLoading ===true && ( 
                  <div className="containerLoader">
                    <CircularProgress />
                  </div>
                )}

                {/* GRID PHOTOGALLERY */} 
                 {this.state.nResults > 0 && (   
                    <Grid container spacing={4}>
                      {this.state.cards.map((card, index) => (
                        <Grid item key={index} xs={12} sm={6} md={4}>
                          <Card className={this.props.classes.card} >
                            <CardMedia
                              className={this.props.classes.cardMedia}
                              image={card.image}
                              title={card.header}
                            />
                            <CardContent className={this.props.classes.cardContent}>
                              <Typography gutterBottom variant="subtitle1" component="h2" >
                                {card.header}
                              </Typography>
                            </CardContent>
                            <CardActions>
                              <Button size="small" color="primary" onClick={e => this.handleClickOpen(card)}>
                                View
                              </Button>
                            </CardActions>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                )}
                 {/* END GRID PHOTOGALLERY */}
            
                {/* DIALOG FULL SCREEN IMAGE */}    
                <Dialog fullScreen open={this.state.isOpen} onClose={this.handleClose}>
                    <AppBar className={this.props.classes.appBar}>
                      <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={this.handleClose} aria-label="close">
                          <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" className={this.props.classes.fullTitle}>
                          Author: {this.state.isOpenCard.author}
                        </Typography>
                      </Toolbar>
                    </AppBar>
                    <Card className={this.props.classes.fullCard}>
                              <CardMedia
                                className={this.props.classes.fullCardMedia}
                                image={this.state.isOpenCard.imageLarge}
                                title={this.state.isOpenCard.header}
                              />
                              <CardContent className={this.props.classes.cardContent}>
                                <Typography gutterBottom variant="subtitle1" component="h2" >
                                  {this.state.isOpenCard.header}
                              </Typography>
                      </CardContent>
                    </Card>
                </Dialog>
                {/* END DIALOG FULL SCREEN IMAGE */}       

              {/* DISPLAY NO RESULTS MESSAGE */}
                {this.state.nResults === 0 && (
                  <Typography variant="h5" align="center" color="textSecondary" paragraph>
                    No results for the keyword: {this.state.keywordReddit}
                  </Typography>
                )}
              {/* END DISPLAY NO RESULTS MESSAGE */}
              </Container>
            </main>
          </React.Fragment>
        );
      }
    //render Album
}

/* STYLE CUSTOM */
const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '15ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  fullTitle: {
    flexGrow: 1,
  },
  fullCard: {
    height: '100vh',
    margin: 'auto'
  },
  fullCardMedia: {
    width: 'auto',
    backgroundSize: 'contain',
    backgroundPosition: 'top',
    height: '80vh'
  }
})
 /* END STYLE CUSTOM */

export default withStyles(styles)(Album)