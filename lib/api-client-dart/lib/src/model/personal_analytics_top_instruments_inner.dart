//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'personal_analytics_top_instruments_inner.g.dart';

/// PersonalAnalyticsTopInstrumentsInner
///
/// Properties:
/// * [instrument] 
/// * [count] 
@BuiltValue()
abstract class PersonalAnalyticsTopInstrumentsInner implements Built<PersonalAnalyticsTopInstrumentsInner, PersonalAnalyticsTopInstrumentsInnerBuilder> {
  @BuiltValueField(wireName: r'instrument')
  String get instrument;

  @BuiltValueField(wireName: r'count')
  int get count;

  PersonalAnalyticsTopInstrumentsInner._();

  factory PersonalAnalyticsTopInstrumentsInner([void updates(PersonalAnalyticsTopInstrumentsInnerBuilder b)]) = _$PersonalAnalyticsTopInstrumentsInner;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(PersonalAnalyticsTopInstrumentsInnerBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<PersonalAnalyticsTopInstrumentsInner> get serializer => _$PersonalAnalyticsTopInstrumentsInnerSerializer();
}

class _$PersonalAnalyticsTopInstrumentsInnerSerializer implements PrimitiveSerializer<PersonalAnalyticsTopInstrumentsInner> {
  @override
  final Iterable<Type> types = const [PersonalAnalyticsTopInstrumentsInner, _$PersonalAnalyticsTopInstrumentsInner];

  @override
  final String wireName = r'PersonalAnalyticsTopInstrumentsInner';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    PersonalAnalyticsTopInstrumentsInner object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'instrument';
    yield serializers.serialize(
      object.instrument,
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
    PersonalAnalyticsTopInstrumentsInner object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required PersonalAnalyticsTopInstrumentsInnerBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'instrument':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.instrument = valueDes;
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
  PersonalAnalyticsTopInstrumentsInner deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = PersonalAnalyticsTopInstrumentsInnerBuilder();
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

