<?php

/* @ongea_theme/components/lists/universal-list.html.twig */
class __TwigTemplate_18dbf82d0363b3123ff5d1eb9ed6092366cdadd259553c12f0cbd6569733aad7 extends Twig_Template
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
        $tags = array("if" => 4, "set" => 6, "for" => 103);
        $filters = array("length" => 5, "t" => 20, "date" => 21, "raw" => 25, "render" => 25);
        $functions = array("path" => 6);

        try {
            $this->env->getExtension('Twig_Extension_Sandbox')->checkSecurity(
                array('if', 'set', 'for'),
                array('length', 't', 'date', 'raw', 'render'),
                array('path')
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
        echo "
";
        // line 3
        echo "
";
        // line 4
        if ( !(null === ($context["data"] ?? null))) {
            // line 5
            echo "    ";
            if ((twig_length_filter($this->env, $this->getAttribute(($context["data"] ?? null), "nid", array())) > 0)) {
                // line 6
                echo "        ";
                $context["url"] = $this->env->getExtension('Drupal\Core\Template\TwigExtension')->getPath("entity.node.canonical", array("node" => $this->getAttribute(($context["data"] ?? null), "nid", array())));
                // line 7
                echo "    ";
            }
            // line 8
            echo "    <div class=\"list-item ";
            if ((twig_length_filter($this->env, $this->getAttribute(($context["data"] ?? null), "listname", array())) > 0)) {
                echo " ";
                echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute(($context["data"] ?? null), "listname", array()), "html", null, true));
                echo " ";
            } else {
                echo " large-list teaser-list ";
            }
            echo "\">
        <div class=\"list-container\">
            <div class=\"row\">
                <a href=\"";
            // line 11
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, ($context["url"] ?? null), "html", null, true));
            echo "\">
                    <div class=\"image-container col-md-5 col-md-push-1\" style=\"background: #323232 url('";
            // line 12
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute($this->getAttribute(($context["data"] ?? null), "image", array()), "url", array()), "html", null, true));
            echo "') no-repeat center; background-size: cover;\"></div>
                </a>
                <div class=\"text-container col-md-6\">
                    <div class=\"-content\">
                        <div class=\"row\">
                            <div>
                                <div class=\"col-xs-4\">
                                    ";
            // line 19
            if ((twig_length_filter($this->env, $this->getAttribute($this->getAttribute(($context["data"] ?? null), "date", array()), "from", array())) > 0)) {
                // line 20
                echo "                                        <p class=\"text-bold\">";
                echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar(t("From")));
                echo "</p>
                                        <p>";
                // line 21
                echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, twig_date_format_filter($this->env, $this->getAttribute($this->getAttribute(($context["data"] ?? null), "date", array()), "from", array()), "d.M. Y"), "html", null, true));
                echo "</p>
                                    ";
            }
            // line 23
            echo "                                    ";
            if ((twig_length_filter($this->env, $this->getAttribute(($context["data"] ?? null), "town", array())) > 0)) {
                // line 24
                echo "                                        <p class=\"text-bold\">";
                echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar(t("Town")));
                echo "</p>
                                        <p>";
                // line 25
                echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar($this->getAttribute(($context["data"] ?? null), "town", array()))));
                echo "</p>
                                    ";
            }
            // line 27
            echo "                                    ";
            if ((twig_length_filter($this->env, $this->getAttribute($this->getAttribute(($context["data"] ?? null), "author", array()), "id", array())) > 0)) {
                // line 28
                echo "                                        <p class=\"text-bold\">";
                echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar(t("Author")));
                echo "</p>
                                        <p class=\"-author\">
                                            <a class=\"-link\" href=\"";
                // line 30
                echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->env->getExtension('Drupal\Core\Template\TwigExtension')->getPath("entity.user.canonical", array("user" => $this->getAttribute($this->getAttribute(($context["data"] ?? null), "author", array()), "id", array()))), "html", null, true));
                echo "\">
                                                ";
                // line 31
                echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute($this->getAttribute(($context["data"] ?? null), "author", array()), "name", array()), "html", null, true));
                echo "
                                            </a>
                                        </p>
                                    ";
            }
            // line 35
            echo "                                    ";
            if ($this->getAttribute($this->getAttribute(($context["data"] ?? null), "permissions", array()), "mail", array())) {
                echo " ";
            } else {
                // line 36
                echo "                                        ";
                if ((twig_length_filter($this->env, $this->getAttribute($this->getAttribute(($context["data"] ?? null), "contact", array()), "email", array())) > 0)) {
                    // line 37
                    echo "                                            <p class=\"text-bold\">";
                    echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar(t("Email address")));
                    echo "</p>
                                            <p class=\"-mail\"><a href=\"mailto: ";
                    // line 38
                    echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute($this->getAttribute(($context["data"] ?? null), "contact", array()), "email", array()), "html", null, true));
                    echo "\">";
                    echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute($this->getAttribute(($context["data"] ?? null), "contact", array()), "email", array()), "html", null, true));
                    echo "</a></p>
                                        ";
                }
                // line 40
                echo "                                    ";
            }
            // line 41
            echo "                                </div>

                                
                                ";
            // line 44
            if ($this->getAttribute(($context["data"] ?? null), "logo", array())) {
                // line 45
                echo "                                    <div class=\"col-xs-4 teaser-logo\">
                                        <div class=\"-logo\" ";
                // line 46
                if ((twig_length_filter($this->env, $this->getAttribute($this->getAttribute(($context["data"] ?? null), "logo", array()), "url", array())) > 3)) {
                    echo " style=\"background: #fff url('";
                    echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute($this->getAttribute(($context["data"] ?? null), "logo", array()), "url", array()), "html", null, true));
                    echo "') no-repeat center; background-size: 75%;\" ";
                }
                echo "></div>
                                    </div>
                                ";
            } else {
                // line 49
                echo "                                    <div class=\"col-xs-4\"></div>
                                ";
            }
            // line 51
            echo "
                                <div class=\"col-xs-4 text-right\">
                                    ";
            // line 53
            if ((twig_length_filter($this->env, $this->getAttribute($this->getAttribute(($context["data"] ?? null), "date", array()), "to", array())) > 0)) {
                // line 54
                echo "                                        <p class=\"text-bold\">";
                echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar(t("To")));
                echo "</p>
                                        <p>";
                // line 55
                echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, twig_date_format_filter($this->env, $this->getAttribute($this->getAttribute(($context["data"] ?? null), "date", array()), "to", array()), "d.M. Y"), "html", null, true));
                echo "</p>
                                    ";
            }
            // line 57
            echo "                                    ";
            if ((twig_length_filter($this->env, $this->getAttribute(($context["data"] ?? null), "country", array())) > 0)) {
                // line 58
                echo "                                        <p class=\"text-bold\">";
                echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar(t("Country")));
                echo "</p>
                                        <p class=\"-body\">";
                // line 59
                echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar($this->getAttribute(($context["data"] ?? null), "country", array()))));
                echo "</p>
                                    ";
            }
            // line 61
            echo "                                    ";
            if ((twig_length_filter($this->env, $this->getAttribute(($context["data"] ?? null), "created", array())) > 0)) {
                // line 62
                echo "                                        <p class=\"text-bold\">";
                echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar(t("Published")));
                echo "</p>
                                        <p class=\"-published\">";
                // line 63
                echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, twig_date_format_filter($this->env, $this->getAttribute(($context["data"] ?? null), "created", array()), "d.M. Y"), "html", null, true));
                echo "</p>
                                    ";
            }
            // line 65
            echo "                                    ";
            if ((twig_length_filter($this->env, $this->getAttribute($this->getAttribute(($context["data"] ?? null), "about", array()), "age", array())) > 0)) {
                // line 66
                echo "                                        <p class=\"text-bold\">";
                echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar(t("Age")));
                echo "</p>
                                        <p class=\"-about\">";
                // line 67
                echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute($this->getAttribute(($context["data"] ?? null), "about", array()), "age", array()), "html", null, true));
                echo "</p>
                                    ";
            }
            // line 69
            echo "                                </div>
                            </div>
                            <div class=\"col-xs-10 col-xs-push-1 -titles \">
                                ";
            // line 72
            if ((twig_length_filter($this->env, $this->getAttribute(($context["data"] ?? null), "title", array())) > 0)) {
                // line 73
                echo "                                    <h2 class=\"-title text-center\">";
                echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute(($context["data"] ?? null), "title", array()), "html", null, true));
                echo "</h2>
                                ";
            }
            // line 75
            echo " 
                                ";
            // line 76
            if ($this->getAttribute($this->getAttribute(($context["data"] ?? null), "permissions", array()), "name", array())) {
                echo " ";
            } else {
                // line 77
                echo "                                    <h2 class=\"-title text-center\">
                                        ";
                // line 78
                echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute(($context["data"] ?? null), "first_name", array()), "html", null, true));
                echo " ";
                echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute(($context["data"] ?? null), "last_name", array()), "html", null, true));
                echo "
                                    </h2>
                                ";
            }
            // line 81
            echo "                                
                                ";
            // line 82
            if ((twig_length_filter($this->env, $this->getAttribute(($context["data"] ?? null), "nickname", array())) > 0)) {
                // line 83
                echo "                                    <p class=\"text-center -nickname\"><i class=\"-nickname-i\">\"";
                echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar($this->getAttribute(($context["data"] ?? null), "nickname", array()))));
                echo "\"</i></p>
                                ";
            }
            // line 85
            echo "
                                ";
            // line 86
            if ($this->getAttribute(($context["data"] ?? null), "subtitle", array())) {
                echo "<h4 class=\"-subtitle text-center\">";
                echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute(($context["data"] ?? null), "subtitle", array()), "html", null, true));
                echo "</h4>";
            }
            // line 87
            echo "                                ";
            if ($this->getAttribute($this->getAttribute(($context["data"] ?? null), "website", array()), "url", array())) {
                echo " 
                                    <p class=\"-website\">
                                        <a href=\"";
                // line 89
                echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute($this->getAttribute(($context["data"] ?? null), "website", array()), "url", array()), "html", null, true));
                echo "\" target=\"_blank\">
                                            ";
                // line 90
                if ($this->getAttribute($this->getAttribute(($context["data"] ?? null), "website", array()), "title", array())) {
                    echo " ";
                    echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute($this->getAttribute(($context["data"] ?? null), "website", array()), "title", array()), "html", null, true));
                    echo " ";
                } else {
                    echo " ";
                    echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute($this->getAttribute(($context["data"] ?? null), "website", array()), "url", array()), "html", null, true));
                    echo " ";
                }
                // line 91
                echo "                                        </a>
                                    </p>
                                ";
            }
            // line 94
            echo "                                ";
            if ($this->getAttribute(($context["data"] ?? null), "description", array())) {
                echo "<p class=\"-description sm-down-hide\">";
                echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute(($context["data"] ?? null), "description", array()), "html", null, true));
                echo "</p>";
            }
            // line 95
            echo "                                ";
            if ($this->getAttribute(($context["data"] ?? null), "body", array())) {
                echo "<p class=\"-body\">";
                echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute(($context["data"] ?? null), "body", array()), "html", null, true));
                echo "</p>";
            }
            // line 96
            echo "                            </div>

                            <div class=\"col-xs-6 -read-more\">
                                ";
            // line 99
            if ($this->getAttribute(($context["data"] ?? null), "taxonomy", array())) {
                // line 100
                echo "                                    <p class=\"text-bold\">";
                echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar(t("Tags")));
                echo "</p>
                                    <p class=\"-tags\">
                                        ";
                // line 102
                $context["all"] = twig_length_filter($this->env, $this->getAttribute(($context["data"] ?? null), "taxonomy", array()));
                // line 103
                echo "                                        ";
                $context['_parent'] = $context;
                $context['_seq'] = twig_ensure_traversable($this->getAttribute(($context["data"] ?? null), "taxonomy", array()));
                foreach ($context['_seq'] as $context["key"] => $context["value"]) {
                    // line 104
                    echo "                                            <a class=\"-term\" href=\"";
                    echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->env->getExtension('Drupal\Core\Template\TwigExtension')->getPath("entity.taxonomy_term.canonical", array("taxonomy_term" => $this->getAttribute($context["value"], "target_id", array()))), "html", null, true));
                    echo "\">
                                                ";
                    // line 105
                    echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute($this->getAttribute($context["value"], "entity", array()), "label", array()), "html", null, true));
                    if ((($context["key"] + 1) < ($context["all"] ?? null))) {
                        echo ",";
                    }
                    // line 106
                    echo "                                            </a> 
                                        ";
                }
                $_parent = $context['_parent'];
                unset($context['_seq'], $context['_iterated'], $context['key'], $context['value'], $context['_parent'], $context['loop']);
                $context = array_intersect_key($context, $_parent) + $_parent;
                // line 108
                echo "                                    </p>
                                ";
            }
            // line 110
            echo "
                                ";
            // line 111
            if ($this->getAttribute(($context["data"] ?? null), "project", array())) {
                // line 112
                echo "                                    <p class=\"text-bold\">";
                echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar(t("Project")));
                echo "</p>
                                    <p class=\"-tags\">
                                        ";
                // line 114
                $context["all"] = twig_length_filter($this->env, $this->getAttribute(($context["data"] ?? null), "project", array()));
                // line 115
                echo "                                        ";
                $context['_parent'] = $context;
                $context['_seq'] = twig_ensure_traversable($this->getAttribute(($context["data"] ?? null), "project", array()));
                foreach ($context['_seq'] as $context["key"] => $context["value"]) {
                    // line 116
                    echo "                                            <a class=\"-link\" href=\"";
                    echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->env->getExtension('Drupal\Core\Template\TwigExtension')->getPath("entity.node.canonical", array("node" => $this->getAttribute($context["value"], "target_id", array()))), "html", null, true));
                    echo "\">
                                                ";
                    // line 117
                    echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute($this->getAttribute($context["value"], "entity", array()), "label", array()), "html", null, true));
                    if ((($context["key"] + 1) < ($context["all"] ?? null))) {
                        echo ",";
                    }
                    // line 118
                    echo "                                            </a> 
                                        ";
                }
                $_parent = $context['_parent'];
                unset($context['_seq'], $context['_iterated'], $context['key'], $context['value'], $context['_parent'], $context['loop']);
                $context = array_intersect_key($context, $_parent) + $_parent;
                // line 120
                echo "                                    </p>
                                ";
            }
            // line 122
            echo "
                                ";
            // line 123
            if ($this->getAttribute(($context["data"] ?? null), "activity_count", array())) {
                // line 124
                echo "                                    ";
                if (($this->getAttribute(($context["data"] ?? null), "activity_count", array()) > 0)) {
                    // line 125
                    echo "                                        <p class=\"text-bold\">";
                    echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar(t("This project contains")));
                    echo "</p>
                                        <p class=\"-tags\"> ";
                    // line 126
                    echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute(($context["data"] ?? null), "activity_count", array()), "html", null, true));
                    echo " ";
                    echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar(t("activities")));
                    echo "</p>
                                    ";
                }
                // line 128
                echo "                                ";
            }
            // line 129
            echo "
                            </div>
                            <div class=\"col-xs-6 -read-more\">
                                ";
            // line 132
            if (($context["url"] ?? null)) {
                // line 133
                echo "                                    <a class=\"-link\" href=\"";
                echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, ($context["url"] ?? null), "html", null, true));
                echo "\"><p class=\"text-right -text\">";
                if ((twig_length_filter($this->env, $this->getAttribute(($context["data"] ?? null), "type", array())) > 0)) {
                    echo " ";
                    echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar(t("Go to")));
                    echo " ";
                    echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute(($context["data"] ?? null), "type", array()), "html", null, true));
                    echo " ";
                } else {
                    echo " ";
                    echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar(t("Read More")));
                    echo " ";
                }
                echo "</p></a>
                                ";
            }
            // line 135
            echo "                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
";
        }
    }

    public function getTemplateName()
    {
        return "@ongea_theme/components/lists/universal-list.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  452 => 135,  434 => 133,  432 => 132,  427 => 129,  424 => 128,  417 => 126,  412 => 125,  409 => 124,  407 => 123,  404 => 122,  400 => 120,  393 => 118,  388 => 117,  383 => 116,  378 => 115,  376 => 114,  370 => 112,  368 => 111,  365 => 110,  361 => 108,  354 => 106,  349 => 105,  344 => 104,  339 => 103,  337 => 102,  331 => 100,  329 => 99,  324 => 96,  317 => 95,  310 => 94,  305 => 91,  295 => 90,  291 => 89,  285 => 87,  279 => 86,  276 => 85,  270 => 83,  268 => 82,  265 => 81,  257 => 78,  254 => 77,  250 => 76,  247 => 75,  241 => 73,  239 => 72,  234 => 69,  229 => 67,  224 => 66,  221 => 65,  216 => 63,  211 => 62,  208 => 61,  203 => 59,  198 => 58,  195 => 57,  190 => 55,  185 => 54,  183 => 53,  179 => 51,  175 => 49,  165 => 46,  162 => 45,  160 => 44,  155 => 41,  152 => 40,  145 => 38,  140 => 37,  137 => 36,  132 => 35,  125 => 31,  121 => 30,  115 => 28,  112 => 27,  107 => 25,  102 => 24,  99 => 23,  94 => 21,  89 => 20,  87 => 19,  77 => 12,  73 => 11,  60 => 8,  57 => 7,  54 => 6,  51 => 5,  49 => 4,  46 => 3,  43 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Twig_Source("", "@ongea_theme/components/lists/universal-list.html.twig", "/var/www/de/ongea/web/themes/contrib/ongea_theme/templates/components/lists/universal-list.html.twig");
    }
}
