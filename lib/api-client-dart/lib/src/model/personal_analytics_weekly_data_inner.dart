//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'personal_analytics_weekly_data_inner.g.dart';

/// PersonalAnalyticsWeeklyDataInner
///
/// Properties:
/// * [week] 
/// * [count] 
@BuiltValue()
abstract class PersonalAnalyticsWeeklyDataInner implements Built<PersonalAnalyticsWeeklyDataInner, PersonalAnalyticsWeeklyDataInnerBuilder> {
  @BuiltValueField(wireName: r'week')
  String get week;

  @BuiltValueField(wireName: r'count')
  int get count;

  PersonalAnalyticsWeeklyDataInner._();

  factory PersonalAnalyticsWeeklyDataInner([void updates(PersonalAnalyticsWeeklyDataInnerBuilder b)]) = _$PersonalAnalyticsWeeklyDataInner;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(PersonalAnalyticsWeeklyDataInnerBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<PersonalAnalyticsWeeklyDataInner> get serializer => _$PersonalAnalyticsWeeklyDataInnerSerializer();
}

class _$PersonalAnalyticsWeeklyDataInnerSerializer implements PrimitiveSerializer<PersonalAnalyticsWeeklyDataInner> {
  @override
  final Iterable<Type> types = const [PersonalAnalyticsWeeklyDataInner, _$PersonalAnalyticsWeeklyDataInner];

  @override
  final String wireName = r'PersonalAnalyticsWeeklyDataInner';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    PersonalAnalyticsWeeklyDataInner object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'week';
    yield serializers.serialize(
      object.week,
      specifiedType: const FullType(String),
    );
    yield r'count';
    yield serializers.serialize(
      object.count,
      specifiedType: const FullType(int),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    PersonalAnalyticsWeeklyDataInner object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required PersonalAnalyticsWeeklyDataInnerBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'week':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.week = valueDes;
          break;
        case r'count':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.count = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  PersonalAnalyticsWeeklyDataInner deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = PersonalAnalyticsWeeklyDataInnerBuilder();
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

