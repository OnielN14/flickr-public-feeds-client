import FeedItem from "../components/FeedItem"
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  Feeds: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(25rem, 1fr))',
    overflow: 'hidden'
  },
  FeedItem__Wrapper: {
  },
  FeedItem: {
    maxHeight: '15rem'
  }
}))

type FeedsProps = {
  items: Array<API.Feed.FeedItem>
}

function Feeds ({ items }: FeedsProps) {
  const styles = useStyles()

  return (
    <div className={[styles.Feeds].join(' ')}>
      {
        items.map((item, index) => (
          <FeedItem key={index} data={item} className={styles.FeedItem}/>
        ))
      }
    </div>
  )
}

export default Feeds