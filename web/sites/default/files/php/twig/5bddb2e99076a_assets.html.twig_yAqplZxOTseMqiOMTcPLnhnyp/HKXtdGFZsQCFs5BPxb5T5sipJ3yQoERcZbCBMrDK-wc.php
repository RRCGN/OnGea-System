<?php

/* @ongea_theme/temporary/assets.html.twig */
class __TwigTemplate_670392f329c74094777513d6b922876571b7134f0397e5beea03f01813f9cab9 extends Twig_Template
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
        $tags = array();
        $filters = array();
        $functions = array("attach_library" => 5);

        try {
            $this->env->getExtension('Twig_Extension_Sandbox')->checkSecurity(
                array(),
                array(),
                array('attach_library')
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
        echo "<!-- Nunito font -->
<link href=\"https://fonts.googleapis.com/css?family=Nunito\" rel=\"stylesheet\">
<link rel=\"stylesheet\" href=\"https://use.fontawesome.com/releases/v5.4.1/css/all.css\" integrity=\"sha384-5sAR7xN1Nv6T6+dT2mhtzEpVJvfS3NScPQTrOxhwjIuvcA67KV2R5Jz6kr4abQsz\" crossorigin=\"anonymous\">

";
        // line 5
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->env->getExtension('Drupal\Core\Template\TwigExtension')->attachLibrary("ongea_theme/ongea-pages"), "html", null, true));
        echo "


<style>
    @media screen and (max-width: 991.98px) { /* \$mdMax */
        .list-item {  position: relative; margin-bottom: 40%; }
        .list-item .list-container .text-container { left: 5px; display: block; height: auto; position: absolute; }
        .list-item .list-container .text-container .-content { margin: auto; padding: 25px; box-shadow: 0 0 25px rgba(0, 0, 0, 0.15); background: #fff; transform: translateX(0); transform: translateY(-50%); }
        .list-item .list-container:hover .image-container { transform: translateY(-20px); }
        
        .list-item.reverse .list-container .text-container { top: 100%; }
        .list-item.reverse .list-container .text-container .-content { transform: translateY(-50%);  }
        .list-item.reverse .list-container:hover .image-container { transform: translateY(-20px); }
    }
</style>
 
<!-- Small list -->
<style>
    @media screen and (max-width: 991.98px) {
        .list-item { margin-bottom: 30%; }
        .small-list .list-container { padding-bottom: 0px; }
        .small-list .list-container .image-container { width: 80%; margin: auto;}
        .small-list .list-container .text-container { padding: 0px; }
        .small-list .list-container .text-container .-content { transform: translateY(-40%); }
        .small-list.reverse .list-container .text-container { top: 100%; }
        .small-list.reverse .list-container .text-container .-content { transform: translateY(-40%);  }
    }
</style>

<!-- Medium list -->
<style>
    @media screen and (max-width: 991.98px) {
        .medium-list .list-container { padding-bottom: 0px; }
        .medium-list .list-container .image-container { width: 80%; margin: auto;}
        .medium-list .list-container .text-container { padding: 0px; }
        .medium-list .list-container .text-container .-content { transform: translateY(-30%); }
        .medium-list.reverse .list-container .text-container { top: 100%; }
        .medium-list.reverse .list-container .text-container .-content { transform: translateY(-30%);  }
    }
</style>
";
    }

    public function getTemplateName()
    {
        return "@ongea_theme/temporary/assets.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  49 => 5,  43 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Twig_Source("", "@ongea_theme/temporary/assets.html.twig", "/var/www/de/ongea/web/themes/contrib/ongea_theme/templates/temporary/assets.html.twig");
    }
}
