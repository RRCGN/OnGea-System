<?php

namespace Drupal\ongea_activity\Plugin\views\style;

use Drupal\rest\Plugin\views\style\Serializer;


/**
 * @ingroup views_style_plugins
 *
 * @ViewsStyle(
 *   id = "ongea_activities_serializer",
 *   title = @Translation("Activities Serializer"),
 *   help = @Translation("Custom serializer for activities"),
 *   display_types = {"data"}
 * )
 *
 * https://gist.github.com/arshad/2ab016c87f31cfd27d16c283cc610ca4
 */
class ActivitiesSerializer extends Serializer {


	/**
	 * {@inheritdoc}
	 */
	public function render() {
		$rows = [];
		// If the Data Entity row plugin is used, this will be an array of entities
		// which will pass through Serializer to one of the registered Normalizers,
		// which will transform it to arrays/scalars. If the Data field row plugin
		// is used, $rows will not contain objects and will pass directly to the
		// Encoder.
		foreach ($this->view->result as $row_index => $row) {
			$this->view->row_index = $row_index;
			$rows[] = $this->view->rowPlugin->render($row);
		}
		unset($this->view->row_index);

		// wrap rows
		$result = array (
			'activities' => $rows
		);

		// Get the content type configured in the display or fallback to the
		// default.
		if ((empty($this->view->live_preview))) {
			$content_type = $this->displayHandler->getContentType();
		}
		else {
			$content_type = !empty($this->options['formats']) ? reset($this->options['formats']) : 'json';
		}
		return $this->serializer->serialize($result, $content_type, ['views_style_plugin' => $this]);
	}

}