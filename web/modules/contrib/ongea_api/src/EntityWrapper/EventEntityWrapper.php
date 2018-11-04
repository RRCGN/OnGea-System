<?php
/**
 * Created by PhpStorm.
 * User: lasse
 * Date: 02.08.18
 * Time: 01:08
 */

namespace Drupal\ongea_api\EntityWrapper;
use Drupal\node\Entity\Node;


class EventEntityWrapper extends OngeaEntityWrapper
{

    const ONGEA_FIELD_EVENT_DAYS = 'field_ongea_event_days';

    const ONGEA_FIELD_START_DAY = 'field_ongea_start_date';

    const ONGEA_FIELD_END_DAY = 'field_ongea_end_date';
    const ONGEA_FIELD_PARALEL_EVENTS = 'field_ongea_parallel_events';
    const ONGEA_FIELD_REPEAT_EVENT = 'field_ongea_repeat_event';
    const ONGEA_FIELD_REPEAT_UNTIL = 'field_ongea_repeat_until';
    const ONGEA_FIELD_REPEAT_CYCLE = 'field_ongea_repeat_cycle';
    const ONGEA_FIELD_START_TIME = 'field_ongea_start_time';
    const ONGEA_FIELD_END_TIME = 'field_ongea_end_time';
    
    
    
    
    

    /**
     * EventEntityWrapper constructor.
     */
    public function __construct($entity)
    {
        parent::__construct($entity);
        $configName = $this->getConfigName();

        $this->loadConfig($configName);

        $data = json_decode(file_get_contents('php://input'), true);
        $this->data = $data;

    }

    public function preCreate($data)
    {
        //$this->data = $data;
    }

    public function getConfigName()
    {
        return 'ongea_api.ongea_event.settings';
    }

    /**
     * @return string
     */
    public static function getContentType()
    {
        return 'ongea_event';
    }

    /**
     * @throws \Exception
     */
    public function postCreate()
    {
        $this->data['place'] = \Drupal\node\Entity\Node::load($this->data['place']);
        // get event days
        /*$startDay = $this->getFIeldFirstValue($this::ONGEA_FIELD_START_DAY);
        $endDay = $this->getFIeldFirstValue($this::ONGEA_FIELD_END_DAY);

        if ($startDay != null && $endDay != null) {
            $this->calculateEventDays($startDay, $endDay);
        }*/



        // How to change config
        /*$config_factory = \Drupal::configFactory();
        $config = $config_factory->getEditable('ongea_api.ongea_event.settings');
        $orig = $config->getOriginal('fields');
        $orig['field_ongea_repeat_cycle'] = ['friendlyName' => 'repeatCycle'];
        $config->set('fields', $orig);
        $config->save(TRUE);print 33;
*/



        $this->entity->save();
        $eid = $this->entity->id();
        /**
         * If repeat event is selected make Event Days instances.
         */
        $repeatEvent = $this->entity->get($this::ONGEA_FIELD_REPEAT_EVENT)[0]->getValue();
        $repeatEvent = $repeatEvent['value'];

        
        $cycleMap = ["hourly" => 3600, "daily" => 86400, "weekly" => 604800, "monthly" => 2592000, "yearly" => 31104000];
        if (empty($repeatEvent)) {
            $this->createStayNode();
        }
        else {

            $startDay = $this->entity->get($this::ONGEA_FIELD_START_DAY)[0]->getString();
            $endDay = $this->entity->get($this::ONGEA_FIELD_END_DAY)[0]->getString();
            $startTime = $this->entity->get($this::ONGEA_FIELD_START_TIME)->getString();
            $endTime = $this->entity->get($this::ONGEA_FIELD_END_TIME)->getString();
            $repeatUntil = $this->entity->get($this::ONGEA_FIELD_REPEAT_UNTIL)[0]->getString();
            $repeatCycle = $this->entity->get($this::ONGEA_FIELD_REPEAT_CYCLE)->getString();
            empty($repeatCycle) ? $repeatCycle = 'daily' : NULL;

            $startArray = explode('-', $startDay);
            $until = strtotime($repeatUntil . ' ' . $startTime) + 1;
            $cycle = $cycleMap[$repeatCycle];
            $start = strtotime($startDay . ' ' . $startTime);
            $end = strtotime($endDay . ' ' . $endTime);
            
            $nextDate = $start;

            if ($repeatCycle == "monthly") {
                $untilArray = explode('-', $repeatUntil);
                $lastMonthsDay = $this->getNextMonthsDay($startArray, $untilArray);
               
                $period = 0;
                if ($untilArray[0] . $untilArray[1] > $startArray[0] . $startArray[1]) {
                    $god = ($untilArray[0] - $startArray[0]) * 12;
                    $mes = $untilArray[1] - $startArray[1]; // can be negative
                    $period = $god + $mes;

                    if ($lastMonthsDay >= $startArray[2]) {
                        $period++;
                    }
                }

                for ($i = 0; $i < $period; $i++) {
                    // Create event day entity
                    $eventDay = $this->createEventDaysNode($nextDate);
                    $this->createStayNode($eventDay);
                    // Connect to event
                    $this->entity->field_ongea_event_days[] = ['target_id' => $eventDay->id()];

                    $nextDate = explode('-', date('Y-m-d', strtotime("+1 month", $nextDate)));
                    $nextDate[2] = $this->getNextMonthsDay($startArray, $nextDate);
                    $nextDate = strtotime($nextDate[0] . '-' . $nextDate[1] . '-' . $nextDate[2] . ' ' . $startTime);
                }
            }
            elseif ($repeatCycle == "yearly") {
                // TODO: fix for if the event is created on Feb.29
                $untilArray = explode('-', $repeatUntil);
                $period = 0;
                if ($untilArray[0] > $startArray[0]) {

                    $period = $untilArray[0] - $startArray[0];

                    // Adjust period if not a full year
                    $untilMonthLower = $untilArray[1] < $startArray[1];
                    $monthsEqual = $untilArray[1] == $startArray[1] && $untilArray[2] < $startArray[2];                
                    // -1 in this case, since it's less then a year
                    if ($untilMonthLower || $monthsEqual) {
                        $period--;
                    }
                }

                for ($i = 0; $i < $period; $i++) {
                    // Create event day entity
                    $eventDay = $this->createEventDaysNode($nextDate);
                    $this->createStayNode($eventDay);
                    // Connect to event
                    $this->entity->field_ongea_event_days[] = ['target_id' => $eventDay->id()];

                    $nextDate = strtotime(($startArray[0] + $i) . '-' . $startArray[1] . '-' . $startArray[2] . ' ' . $startTime);
                }
            }
            else {
                // If start is 10:19, until 12:00 we can have 2 hourly meetings
                $period = floor(($until - $start) / $cycle);
                for ($i = 0; $i <= $period; $i++) {
                    // create event day entity
                    $eventDay = $this->createEventDaysNode($nextDate);
                    $this->createStayNode($eventDay);
                    // connect to event
                    $this->entity->field_ongea_event_days[] = ['target_id' => $eventDay->id()];

                    switch($repeatCycle){
                        case 'hourly':
                            $add = ' +1 hours';
                        break;
                        case 'daily':
                            $add = ' +1 day';
                        break;
                        case 'weekly':
                            $add = ' +1 week';
                        break;
                    }
                    $nextDate = strtotime((date('Y-m-d H:i:s', $nextDate)).$add);
                }
            }
            
            $this->entity->save();
        }



        /** 
         * If paralel event is selected iterate all of them and add this event to those events
         */
        // Get the paralel event we just attached to the newly created event.
        $paralelEvent = $this->entity->get($this::ONGEA_FIELD_PARALEL_EVENTS)[0];
        // From that one get all his paralel events
        if (isset($paralelEvent)) {
            $otherEvents = $paralelEvent->entity->get($this::ONGEA_FIELD_PARALEL_EVENTS);
            $nids = [$paralelEvent->entity->id()];
            foreach ($otherEvents as $event) {
                $nids[] = $event->entity->id();
                // Add the new event to each of them
                $event->entity->field_ongea_parallel_events[] = ['target_id' => $this->entity->id()];
                $event->entity->save();
            }
            // Add the paralel + other events to the newly created event (set does override,
            // so that's why we repeat the paralel event)
            $this->entity->set($this::ONGEA_FIELD_PARALEL_EVENTS, $nids);
            // Add the new event to the paralel event
            $paralelEvent->entity->field_ongea_parallel_events[] = ['target_id' => $this->entity->id()];
            $paralelEvent->entity->save();
        }

    }

    public function createEventDaysNode($date) {
        $node = Node::create(array(
            'type' => 'ongea_event_days',
            'title' => $this->entity->get('title')->value . ' ' . t('episode') . ' ' . ($this->entity->field_ongea_event_days->count() + 1),
            'langcode' => 'en',
            'uid' => $this->entity->get('uid'),
            'status' => 1,
            'field_ongea_event_day_date' => [$date],
        ));

        $node->save();

        return $node;
    }
    public function createStayNode($eventDay = NULL) {

        //get event start and end
        $startDay = $this->entity->get($this::ONGEA_FIELD_START_DAY)[0]->getString();
        $endDay = $this->entity->get($this::ONGEA_FIELD_END_DAY)[0]->getString();
        $startTime = $this->entity->get($this::ONGEA_FIELD_START_TIME)->getString();
        $endTime = $this->entity->get($this::ONGEA_FIELD_END_TIME)->getString();
        $start = strtotime($startDay . ' ' . $startTime);
        $end = strtotime($endDay . ' ' . $endTime);

        if (isset($eventDay)) {
            $title = $eventDay->get('title')->value;
            $eDayId = $eventDay->id();

            $diff = $end - $start; // get length of event
            // get eventDay start
            $start = $eventDay->get('field_ongea_event_day_date')->value;
            $end = $start + $diff; // end time of eventDay is eventDay start + event length
            
            
        } else {
            $title = $this->entity->get('title')->value;
            $eDayId = NULL;
        }
        $start = date('Y-m-d\TH:i:s', $start);
        $end = date('Y-m-d\TH:i:s', $end);
        $node = Node::create(array(
            'type' => 'ongea_stay',
            'title' => 'Stay for ' . $title,
            'langcode' => 'en',
            'uid' => $this->entity->get('uid'),
            'status' => 1,
            //'field_ongea_reduced_price' => 'bool',
            //'field_ongea_room_number' => 'text',
            'field_ongea_event' => [['target_id' => $this->entity->id()]],
            'field_ongea_stay_event_day' => $eDayId ? [['target_id' => $eDayId]] : [],
            'field_ongea_datefrom' => [$start],
            'field_ongea_dateto' => [$end],
            
            /*
            'field_ongea_first_service' => 'date',
            'field_ongea_key_deposit_status' => 'list text',
            'field_ongea_key_status' => 'list text',
            'field_ongea_last_service' => 'date',
            'field_ongea_location' => 'geoloc',
            'field_ongea_service_use' => 'list text',
            'field_ongea_stay_information' => 'text',*/
        ));

        $node->save();

        return $node;
    }


    /**
     * @param $startDay
     * @param $endDay
     *
     * @throws \Exception
     */
    public function calculateEventDays($startDay, $endDay)
    {
        /** @var \Drupal\ongea_api\EntityWrapper\OngeaEntityWrapperManager $wrapperManager */
        $wrapperManager = $this->container->get(
          'ongea_api.entity_wrapper_manager'
        );


        // calculate event days
        $startDayDateTime = new \DateTimeImmutable($startDay);
        $endDayDateTime = new \DateTimeImmutable($endDay);

        $eventDaysInterval = $endDayDateTime->diff($startDayDateTime);

        $eventDaysCount = $eventDaysInterval->days;


        // create event days
        for ($i = 0; $i < $eventDaysCount; $i++) {
            // event Day create
            $eventDay = $wrapperManager->create('ongea_event_days');
        }


    }
    public function getNextMonthsDay($startArray, $endArray) {

        if ($startArray[2] = 31 && in_array($endArray[1],[2, 4, 6, 9, 11])) {
            $endArray[2] = 31;
        }
        if ($startArray[2] > 28 && $endArray[1] == 2) {
            $endArray[2] = 28;
        }
        return $endArray[2];
    }
}