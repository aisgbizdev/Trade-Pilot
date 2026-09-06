//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:trade_pilot_api_client/src/model/feedback_with_details.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'feedback_list.g.dart';

/// FeedbackList
///
/// Properties:
/// * [feedback] 
/// * [total] 
/// * [page] 
/// * [limit] 
@BuiltValue()
abstract class FeedbackList implements Built<FeedbackList, FeedbackListBuilder> {
  @BuiltValueField(wireName: r'feedback')
  BuiltList<FeedbackWithDetails> get feedback;

  @BuiltValueField(wireName: r'total')
  int get total;

  @BuiltValueField(wireName: r'page')
  int get page;

  @BuiltValueField(wireName: r'limit')
  int get limit;

  FeedbackList._();

  factory FeedbackList([void updates(FeedbackListBuilder b)]) = _$FeedbackList;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(FeedbackListBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<FeedbackList> get serializer => _$FeedbackListSerializer();
}

class _$FeedbackListSerializer implements PrimitiveSerializer<FeedbackList> {
  @override
  final Iterable<Type> types = const [FeedbackList, _$FeedbackList];

  @override
  final String wireName = r'FeedbackList';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    FeedbackList object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'feedback';
    yield serializers.serialize(
      object.feedback,
      specifiedType: const FullType(BuiltList, [FullType(FeedbackWithDetails)]),
    );
    yield r'total';
    yield serializers.serialize(
      object.total,
      specifiedType: const FullType(int),
    );
    yield r'page';
    yield serializers.serialize(
      object.page,
      specifiedType: const FullType(int),
    );
    yield r'limit';
    yield serializers.serialize(
      object.limit,
      specifiedType: const FullType(int),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    FeedbackList object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required FeedbackListBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'feedback':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(FeedbackWithDetails)]),
          ) as BuiltList<FeedbackWithDetails>;
          result.feedback.replace(valueDes);
          break;
        case r'total':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.total = valueDes;
          break;
        case r'page':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.page = valueDes;
          break;
        case r'limit':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.limit = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  FeedbackList deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = FeedbackListBuilder();
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

