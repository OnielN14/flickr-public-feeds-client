import { Card, CardActionArea, CardContent, CardMedia, Typography, makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  FeedItems: {
    border: 'none',
    display: 'flex',
    borderRadius: '0px',
    '&:not(:hover)': {
      '& $FeedItems__Content': {
        transform: 'translateY(100%)'
      }
    }
  },
  FeedItems__Container: {
    position:'relative',
    overflow: 'hidden',
  },
  FeedItems__Media: {
    height: '100%'
  },
  FeedItems__Content: {
    position:'absolute',
    inset: 'auto 0px 0px 0px',
    padding: '0.5rem',
    background: 'linear-gradient(0deg, rgba(0 0 0 / 50%) 33%, transparent)',
    color: 'white',
    transition: theme.transitions.create('transform')
  },
  FeedItems__Title: {
    lineHeight: '1.25'
  }
}))

export type FeedItemProps = {
  data: API.Feed.FeedItem;
  className?: string
}


function FeedItem ({ className, data: { author, media, title } }: FeedItemProps) {
  const styles = useStyles()

  return (
    <Card classes={{ root: [styles.FeedItems, className].join(' ') }} elevation={0}>
      <CardActionArea classes={{root: styles.FeedItems__Container}}>
        <CardMedia component="img" classes={{root: styles.FeedItems__Media}} title={title} src={media.m}/>
        <CardContent className={styles.FeedItems__Content}>
          <Typography classes={{ root: styles.FeedItems__Title }} variant="h6">{title}</Typography>
          <Typography variant="caption">Author: {author}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default FeedItem