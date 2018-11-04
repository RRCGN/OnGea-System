<?php

/* @ongea_theme/node/node/news.html.twig */
class __TwigTemplate_384183be0245f258736b77a6d78261a1ca9f19e1fec33ffd775c0209bbeb6398 extends Twig_Template
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
        $tags = array("set" => 1, "include" => 35);
        $filters = array("length" => 10, "raw" => 10, "slice" => 10, "clean_class" => 24);
        $functions = array("file_url" => 12);

        try {
            $this->env->getExtension('Twig_Extension_Sandbox')->checkSecurity(
                array('set', 'include'),
                array('length', 'raw', 'slice', 'clean_class'),
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
        $context["text"] = $this->getAttribute($this->getAttribute(($context["node"] ?? null), "body", array()), "summary", array());
        // line 2
        $context["data"] = array("nid" => $this->getAttribute(        // line 3
($context["node"] ?? null), "id", array()), "author" => array("id" => $this->getAttribute($this->getAttribute($this->getAttribute(        // line 5
($context["node"] ?? null), "Owner", array()), "uid", array()), "value", array()), "name" => $this->getAttribute($this->getAttribute($this->getAttribute(        // line 6
($context["node"] ?? null), "Owner", array()), "name", array()), "value", array())), "name" => $this->getAttribute(        // line 8
($context["node"] ?? null), "label", array()), "title" => $this->getAttribute(        // line 9
($context["node"] ?? null), "label", array()), "body" => (((twig_length_filter($this->env,         // line 10
($context["text"] ?? null)) > 450)) ? ((twig_slice($this->env, ($context["text"] ?? null), 0, 450) . "...")) : (($context["text"] ?? null))), "image" => array("url" => call_user_func_array($this->env->getFunction('file_url')->getCallable(), array($this->getAttribute($this->getAttribute($this->getAttribute($this->getAttribute(        // line 12
($context["node"] ?? null), "field_image", array()), "entity", array()), "uri", array()), "value", array()))), "alt" => $this->getAttribute($this->getAttribute(        // line 13
($context["node"] ?? null), "field_image", array()), "alt", array())), "taxonomy" => $this->getAttribute(        // line 15
($context["node"] ?? null), "field_tags", array()), "created" => $this->getAttribute($this->getAttribute(        // line 16
($context["node"] ?? null), "created", array()), "value", array()), "listname" =>         // line 17
($context["listname"] ?? null));
        // line 19
        echo "


";
        // line 23
        $context["classes"] = array(0 => \Drupal\Component\Utility\Html::getClass($this->getAttribute(        // line 24
($context["node"] ?? null), "bundle", array())), 1 => (($this->getAttribute(        // line 25
($context["node"] ?? null), "isPromoted", array(), "method")) ? ("is-promoted") : ("")), 2 => (($this->getAttribute(        // line 26
($context["node"] ?? null), "isSticky", array(), "method")) ? ("is-sticky") : ("")), 3 => (( !$this->getAttribute(        // line 27
($context["node"] ?? null), "isPublished", array(), "method")) ? ("is-unpublished") : ("")), 4 => ((        // line 28
($context["view_mode"] ?? null)) ? (\Drupal\Component\Utility\Html::getClass(($context["view_mode"] ?? null))) : ("")), 5 => "clearfix");
        // line 32
        echo "
<article";
        // line 33
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute(($context["attributes"] ?? null), "addClass", array(0 => ($context["classes"] ?? null)), "method"), "html", null, true));
        echo ">
    ";
        // line 34
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, ($context["title_prefix"] ?? null), "html", null, true));
        echo "
        ";
        // line 35
        $this->loadTemplate("@ongea_theme/components/lists/universal-list.html.twig", "@ongea_theme/node/node/news.html.twig", 35)->display(array_merge($context, ($context["data"] ?? null)));
        // line 36
        echo "    ";
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, ($context["title_suffix"] ?? null), "html", null, true));
        echo "
</article>
";
    }

    public function getTemplateName()
    {
        return "@ongea_theme/node/node/news.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  83 => 36,  81 => 35,  77 => 34,  73 => 33,  70 => 32,  68 => 28,  67 => 27,  66 => 26,  65 => 25,  64 => 24,  63 => 23,  58 => 19,  56 => 17,  55 => 16,  54 => 15,  53 => 13,  52 => 12,  51 => 10,  50 => 9,  49 => 8,  48 => 6,  47 => 5,  46 => 3,  45 => 2,  43 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Twig_Source("", "@ongea_theme/node/node/news.html.twig", "/var/www/de/ongea/web/themes/contrib/ongea_theme/templates/node/node/news.html.twig");
    }
}
