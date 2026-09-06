//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:trade_pilot_api_client/src/model/mirror_gated_insight.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'trader_mirror_insights.g.dart';

/// Personal trader-mirror insights bundle (task #162). Every category respects a minimum-sample guardrail.
///
/// Properties:
/// * [windowDays] 
/// * [totalResolved] 
/// * [overallGated] 
/// * [sessions] 
/// * [instruments] 
/// * [timing] 
/// * [postLoss] 
/// * [exitDiscipline] 
@BuiltValue()
abstract class TraderMirrorInsights implements Built<TraderMirrorInsights, TraderMirrorInsightsBuilder> {
  @BuiltValueField(wireName: r'windowDays')
  int get windowDays;

  @BuiltValueField(wireName: r'totalResolved')
  int get totalResolved;

  @BuiltValueField(wireName: r'overallGated')
  bool get overallGated;

  @BuiltValueField(wireName: r'sessions')
  MirrorGatedInsight get sessions;

  @BuiltValueField(wireName: r'instruments')
  MirrorGatedInsight get instruments;

  @BuiltValueField(wireName: r'timing')
  MirrorGatedInsight get timing;

  @BuiltValueField(wireName: r'postLoss')
  MirrorGatedInsight get postLoss;

  @BuiltValueField(wireName: r'exitDiscipline')
  MirrorGatedInsight get exitDiscipline;

  TraderMirrorInsights._();

  factory TraderMirrorInsights([void updates(TraderMirrorInsightsBuilder b)]) = _$TraderMirrorInsights;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(TraderMirrorInsightsBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<TraderMirrorInsights> get serializer => _$TraderMirrorInsightsSerializer();
}

class _$TraderMirrorInsightsSerializer implements PrimitiveSerializer<TraderMirrorInsights> {
  @override
  final Iterable<Type> types = const [TraderMirrorInsights, _$TraderMirrorInsights];

  @override
  final String wireName = r'TraderMirrorInsights';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    TraderMirrorInsights object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'windowDays';
    yield serializers.serialize(
      object.windowDays,
      specifiedType: const FullType(int),
    );
    yield r'totalResolved';
    yield serializers.serialize(
      object.totalResolved,
      specifiedType: const FullType(int),
    );
    yield r'overallGated';
    yield serializers.serialize(
      object.overallGated,
      specifiedType: const FullType(bool),
    );
    yield r'sessions';
    yield serializers.serialize(
      object.sessions,
      specifiedType: const FullType(MirrorGatedInsight),
    );
    yield r'instruments';
    yield serializers.serialize(
      object.instruments,
      specifiedType: const FullType(MirrorGatedInsight),
    );
    yield r'timing';
    yield serializers.serialize(
      object.timing,
      specifiedType: const FullType(MirrorGatedInsight),
    );
    yield r'postLoss';
    yield serializers.serialize(
      object.postLoss,
      specifiedType: const FullType(MirrorGatedInsight),
    );
    yield r'exitDiscipline';
    yield serializers.serialize(
      object.exitDiscipline,
      specifiedType: const FullType(MirrorGatedInsight),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    TraderMirrorInsights object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required TraderMirrorInsightsBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'windowDays':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.windowDays = valueDes;
          break;
        case r'totalResolved':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.totalResolved = valueDes;
          break;
        case r'overallGated':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(bool),
          ) as bool;
          result.overallGated = valueDes;
          break;
        case r'sessions':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(MirrorGatedInsight),
          ) as MirrorGatedInsight;
          result.sessions.replace(valueDes);
          break;
        case r'instruments':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(MirrorGatedInsight),
          ) as MirrorGatedInsight;
          result.instruments.replace(valueDes);
          break;
        case r'timing':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(MirrorGatedInsight),
          ) as MirrorGatedInsight;
          result.timing.replace(valueDes);
          break;
        case r'postLoss':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(MirrorGatedInsight),
          ) as MirrorGatedInsight;
          result.postLoss.replace(valueDes);
          break;
        case r'exitDiscipline':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(MirrorGatedInsight),
          ) as MirrorGatedInsight;
          result.exitDiscipline.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  TraderMirrorInsights deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = TraderMirrorInsightsBuilder();
    final serializedList = (serialized as Iterable<Object?>).toList();
    final unhandled = <Object?>[];
    _deserializeProperties(
      serializers,
      serialized,
      specifiedType: specifiedType,
      serializedList: serializedList,
      unhandled: unhandled,
      result: result,
    );
    return result.build();
  }
}

