<?php

/* @ongea_theme/node/node/project.html.twig */
class __TwigTemplate_74721cea923ac1de70d62d2a15793d0b168e40d6e4753dec487d7f660ac59cf9 extends Twig_Template
{
    public function __construct(Twig_Environment $env)
    {
        parent::__construct($env);

        $this->parent = false;

        $this->blocks = array(
        );
    }

    protected function doDisplay(array $context, array $blocks = array())
    {
        $tags = array("set" => 1, "include" => 39);
        $filters = array("striptags" => 1, "render" => 1, "t" => 2, "length" => 12, "raw" => 12, "slice" => 12, "clean_class" => 28);
        $functions = array("file_url" => 14);

        try {
            $this->env->getExtension('Twig_Extension_Sandbox')->checkSecurity(
                array('set', 'include'),
                array('striptags', 'render', 't', 'length', 'raw', 'slice', 'clean_class'),
                array('file_url')
            );
        } catch (Twig_Sandbox_SecurityError $e) {
            $e->setSourceContext($this->getSourceContext());

            if ($e instanceof Twig_Sandbox_SecurityNotAllowedTagError && isset($tags[$e->getTagName()])) {
                $e->setTemplateLine($tags[$e->getTagName()]);
            } elseif ($e instanceof Twig_Sandbox_SecurityNotAllowedFilterError && isset($filters[$e->getFilterName()])) {
                $e->setTemplateLine($filters[$e->getFilterName()]);
            } elseif ($e instanceof Twig_Sandbox_SecurityNotAllowedFunctionError && isset($functions[$e->getFunctionName()])) {
                $e->setTemplateLine($functions[$e->getFunctionName()]);
            }

            throw $e;
        }

        // line 1
        $context["text"] = strip_tags($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar($this->getAttribute($this->getAttribute(($context["node"] ?? null), "field_ongea_project_desc", array()), "value", array())));
        // line 2
        $context["type"] = t("Project");
        // line 3
        $context["data"] = array("nid" => $this->getAttribute(        // line 4
($context["node"] ?? null), "id", array()), "date" => array("from" => $this->getAttribute($this->getAttribute(        // line 6
($context["node"] ?? null), "field_ongea_project_datefrom", array()), "value", array()), "to" => $this->getAttribute($this->getAttribute(        // line 7
($context["node"] ?? null), "field_ongea_project_dateto", array()), "value", array())), "name" => $this->getAttribute(        // line 9
($context["node"] ?? null), "label", array()), "title" => $this->getAttribute(        // line 10
($context["node"] ?? null), "label", array()), "subtitle" => $this->getAttribute($this->getAttribute(        // line 11
($context["node"] ?? null), "field_ongea_project_subtitle", array()), "value", array()), "description" => (((twig_length_filter($this->env,         // line 12
($context["text"] ?? null)) > 450)) ? ((twig_slice($this->env, ($context["text"] ?? null), 0, 450) . "...")) : (($context["text"] ?? null))), "image" => array("url" => call_user_func_array($this->env->getFunction('file_url')->getCallable(), array($this->getAttribute($this->getAttribute($this->getAttribute($this->getAttribute(        // line 14
($context["node"] ?? null), "field_ongea_project_image", array()), "entity", array()), "uri", array()), "value", array()))), "alt" => $this->getAttribute($this->getAttribute(        // line 15
($context["node"] ?? null), "field_ongea_project_image", array()), "alt", array())), "logo" => array("url" => call_user_func_array($this->env->getFunction('file_url')->getCallable(), array($this->getAttribute($this->getAttribute($this->getAttribute($this->getAttribute(        // line 18
($context["node"] ?? null), "field_ongea_project_logo", array()), "entity", array()), "uri", array()), "value", array()))), "alt" => $this->getAttribute($this->getAttribute(        // line 19
($context["node"] ?? null), "field_ongea_project_logo", array()), "alt", array())), "activity_count" =>         // line 21
($context["activity_count"] ?? null), "type" =>         // line 22
($context["type"] ?? null), "listname" =>         // line 23
($context["listname"] ?? null));
        // line 25
        echo "
";
        // line 27
        $context["classes"] = array(0 => \Drupal\Component\Utility\Html::getClass($this->getAttribute(        // line 28
($context["node"] ?? null), "bundle", array())), 1 => (($this->getAttribute(        // line 29
($context["node"] ?? null), "isPromoted", array(), "method")) ? ("is-promoted") : ("")), 2 => (($this->getAttribute(        // line 30
($context["node"] ?? null), "isSticky", array(), "method")) ? ("is-sticky") : ("")), 3 => (( !$this->getAttribute(        // line 31
($context["node"] ?? null), "isPublished", array(), "method")) ? ("is-unpublished") : ("")), 4 => ((        // line 32
($context["view_mode"] ?? null)) ? (\Drupal\Component\Utility\Html::getClass(($context["view_mode"] ?? null))) : ("")), 5 => "clearfix");
        // line 36
        echo "
<article";
        // line 37
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute(($context["attributes"] ?? null), "addClass", array(0 => ($context["classes"] ?? null)), "method"), "html", null, true));
        echo ">
    ";
        // line 38
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, ($context["title_prefix"] ?? null), "html", null, true));
        echo "
        ";
        // line 39
        $this->loadTemplate("@ongea_theme/components/lists/universal-list.html.twig", "@ongea_theme/node/node/project.html.twig", 39)->display(array_merge($context, ($context["data"] ?? null)));
        // line 40
        echo "    ";
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, ($context["title_suffix"] ?? null), "html", null, true));
        echo "
</article>";
    }

    public function getTemplateName()
    {
        return "@ongea_theme/node/node/project.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  86 => 40,  84 => 39,  80 => 38,  76 => 37,  73 => 36,  71 => 32,  70 => 31,  69 => 30,  68 => 29,  67 => 28,  66 => 27,  63 => 25,  61 => 23,  60 => 22,  59 => 21,  58 => 19,  57 => 18,  56 => 15,  55 => 14,  54 => 12,  53 => 11,  52 => 10,  51 => 9,  50 => 7,  49 => 6,  48 => 4,  47 => 3,  45 => 2,  43 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Twig_Source("", "@ongea_theme/node/node/project.html.twig", "/var/www/de/ongea/web/themes/contrib/ongea_theme/templates/node/node/project.html.twig");
    }
}
