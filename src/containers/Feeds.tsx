import FeedItem, { FeedItemType } from "../components/FeedItem"
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  Feeds: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(20rem, 1fr))',
  },
  FeedItem__Wrapper: {
  },
  FeedItem: {
    height: '10rem'
  }
}))

type FeedsProps = {
  items: Array<FeedItemType>
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